import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { OpenApiValidator } from 'express-openapi-validator';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';
import twilio from 'twilio';

const app = express();
const port = 3000;

// Charger le schéma OpenAPI depuis la racine du monorepo
const openApiPath = path.resolve(__dirname, '../../openapi.yaml');
const openApiDocument = YAML.load(openApiPath);

// Swagger UI sur /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Middleware pour parser le JSON
app.use(express.json());

// Remplacez par vos propres valeurs d'environnement
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Middleware pour extraire l'ID utilisateur du JWT Bearer
function getUserIdFromAuthHeader(req: express.Request): string | null {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.replace('Bearer ', '');
  try {
    // Le JWT Supabase a l'id utilisateur dans le champ 'sub'
    const decoded: any = jwt.decode(token);
    return decoded?.sub || null;
  } catch {
    return null;
  }
}

// Ajout du middleware pour parser application/x-www-form-urlencoded
app.use('/webhook/twilio', express.urlencoded({ extended: false }));

// Validation OpenAPI
new OpenApiValidator({
  apiSpec: openApiPath,
  validateRequests: true,
  validateResponses: false,
}).install(app)
  .then(() => {
    // ...routes existantes...
    app.get('/', (_req, res) => {
      res.send('Hello World from API Gateway!');
    });

    app.post('/api/agent', async (req, res) => {
      const { nom, secteur_activite, ton, langue } = req.body;
      if (!nom || !secteur_activite || !ton || !langue) {
        return res.status(400).json({ error: 'Champs manquants' });
      }
      const userId = getUserIdFromAuthHeader(req);
      if (!userId) {
        return res.status(401).json({ error: 'Non authentifié' });
      }
      const { data, error } = await supabase
        .from('agents')
        .insert([{ nom, secteur_activite, ton, langue, user_id: userId }])
        .select('id')
        .single();
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      const agentId = data.id;

      // 1. Acheter un numéro Twilio (locale FR)
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      let purchasedNumber;
      try {
        const numbers = await client.availablePhoneNumbers('FR').local.list({limit: 1});
        if (!numbers.length) throw new Error('Aucun numéro FR disponible');
        purchasedNumber = await client.incomingPhoneNumbers.create({
          phoneNumber: numbers[0].phoneNumber,
          voiceUrl: `https://<your-domain>/webhook/twilio/${agentId}`,
          voiceMethod: 'POST'
        });
      } catch (err) {
        return res.status(500).json({error: 'Erreur achat/configuration numéro Twilio', details: err.message});
      }

      // 2. Mettre à jour l’agent dans Supabase avec le numéro Twilio acheté
      try {
        await supabase
          .from('agents')
          .update({ phone_number: purchasedNumber.phoneNumber })
          .eq('id', agentId);
      } catch (err) {
        return res.status(500).json({error: 'Erreur update agent phone_number', details: err.message});
      }

      return res.status(201).json({ id: agentId, phone_number: purchasedNumber.phoneNumber });
    });

    app.get('/api/calls/:callId/messages', async (req, res) => {
      const userId = getUserIdFromAuthHeader(req);
      if (!userId) {
        return res.status(401).json({ error: 'Non authentifié' });
      }
      const { callId } = req.params;
      if (!callId) {
        return res.status(400).json({ error: 'callId manquant' });
      }
      const { data, error } = await supabase
        .from('messages')
        .select('id, role, content, timestamp')
        .eq('call_id', callId)
        .order('timestamp', { ascending: true });
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.json(data || []);
    });

    const upload = multer();

    app.post('/api/asr', upload.single('file'), async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
    
        // Préparer le form-data pour le microservice ASR
        const form = new FormData();
        form.append('file', req.file.buffer, {
          filename: req.file.originalname,
          contentType: req.file.mimetype,
        });
    
        // Envoyer au microservice ASR
        const asrRes = await fetch('http://localhost:4001/transcribe', {
          method: 'POST',
          body: form,
          headers: form.getHeaders(),
        });
    
        if (!asrRes.ok) {
          return res.status(502).json({ error: 'ASR service error' });
        }
    
        const data = await asrRes.json();
        // Renvoie la réponse telle quelle
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    app.post('/api/calls/:callId/transcribe', upload.single('file'), async (req, res) => {
      try {
        // Authentification Bearer
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        // Optionnel: vérifier le token avec Supabase si besoin
    
        // Vérifier le fichier
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }
    
        // Forwarder le fichier à Whisper
        const whisperRes = await fetch(process.env.WHISPER_URL || 'http://localhost:8000/transcribe', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: (() => {
            const form = new FormData();
            form.append('file', req.file.buffer, req.file.originalname);
            return form;
          })()
        });
    
        if (!whisperRes.ok) {
          return res.status(502).json({ error: 'ASR service error' });
        }
        const whisperJson = await whisperRes.json();
        const { text, language } = whisperJson;
    
        // Enregistrer la transcription dans Supabase (message utilisateur)
        const { data: userMsgData, error: userMsgError } = await supabase
          .from('messages')
          .insert([{
            call_id: req.params.callId,
            role: 'user',
            content: text,
            timestamp: new Date().toISOString(),
            langue: language
          }])
          .select('id')
          .single();
    
        if (userMsgError) {
          return res.status(500).json({ error: 'DB insert error', details: userMsgError.message });
        }

        // Récupérer l'historique des messages de l'appel
        const { data: historyData, error: historyError } = await supabase
          .from('messages')
          .select('role, content')
          .eq('call_id', req.params.callId)
          .order('timestamp', { ascending: true });

        if (historyError) {
          return res.status(500).json({ error: 'DB history error', details: historyError.message });
        }

        // Appeler la route locale /api/nlp/reply
        const nlpRes = await fetch('http://localhost:3000/api/nlp/reply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            history: historyData,
            question: text
          }),
        });

        if (!nlpRes.ok) {
          return res.status(502).json({ error: 'NLP service error' });
        }
        const nlpJson = await nlpRes.json();
        const answer = nlpJson.answer;

        // Insérer le message agent dans Supabase
        const { data: agentMsgData, error: agentMsgError } = await supabase
          .from('messages')
          .insert([{
            call_id: req.params.callId,
            role: 'agent',
            content: answer,
            timestamp: new Date().toISOString(),
            langue: language
          }])
          .select('id')
          .single();

        if (agentMsgError) {
          return res.status(500).json({ error: 'DB insert error', details: agentMsgError.message });
        }

        // Appeler le service TTS pour générer le MP3 de la réponse agent
        const ttsResponse = await fetch('http://localhost:3000/api/tts/speak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: answer,
            langue: language,
            // Optionnel: voice_id à ajouter si besoin
          }),
        });

        if (!ttsResponse.ok || !ttsResponse.body) {
          return res.status(502).json({ error: 'TTS service error' });
        }

        // 1. Récupérer le flux MP3 depuis la réponse TTS
        const mp3Stream = ttsResponse.body;
        // 2. Construire le chemin du fichier
        const audioPath = `calls/${req.params.callId}/agent-${agentMsgData.id}.mp3`;

        // 3. Uploader dans Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('audios')
          .upload(audioPath, mp3Stream, {
            contentType: 'audio/mpeg',
            upsert: true
          });

        if (uploadError) {
          // Gérer l'erreur d'upload
          return res.status(500).json({ error: 'Erreur upload audio Supabase', details: uploadError.message });
        }

        // 4. Générer l'URL publique ou signée
        const { data: publicUrlData } = supabase.storage
          .from('audios')
          .getPublicUrl(audioPath);
        const audioUrl = publicUrlData.publicUrl;

        // 5. Mettre à jour le message agent avec le champ audio_url
        const { error: updateError } = await supabase
          .from('messages')
          .update({ audio_url: audioUrl })
          .eq('id', agentMsgData.id);

        if (updateError) {
          // Gérer l'erreur de mise à jour
          return res.status(500).json({ error: 'Erreur update audio_url', details: updateError.message });
        }

        res.json({
          user_message_id: userMsgData.id,
          agent_message_id: agentMsgData.id,
          answer
        });
      } catch (e) {
        res.status(500).json({ error: 'Internal error', details: e.message });
      }
    });

    app.post('/api/nlp/reply', async (req, res) => {
      // Authentification simple via header Authorization: Bearer ...
      const auth = req.headers.authorization;
      if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // Optionnel: vérifier le token ici (à implémenter selon votre logique)
    
      const { history, question } = req.body;
      if (!history || !question) {
        return res.status(400).json({ error: 'Missing history or question' });
      }
    
      try {
        const nlpRes = await fetch('http://localhost:4002/reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history, question }),
        });
        if (!nlpRes.ok) {
          return res.status(502).json({ error: 'NLP service error' });
        }
        const data = await nlpRes.json();
        // data doit contenir { answer }
        return res.json({ answer: data.answer });
      } catch (err) {
        return res.status(500).json({ error: 'Gateway error' });
      }
    });

    app.post('/api/tts/speak', async (req, res) => {
      const auth = req.headers['authorization'];
      if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { text, langue, voice_id } = req.body;
      if (!text || !langue) {
        return res.status(400).json({ error: 'Missing text or langue' });
      }
    
      try {
        const ttsRes = await fetch('http://localhost:4003/speak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth,
          },
          body: JSON.stringify({ text, langue, voice_id }),
        });
    
        if (!ttsRes.ok || !ttsRes.body) {
          return res.status(502).json({ error: 'TTS service error' });
        }
    
        res.setHeader('Content-Type', 'audio/mpeg');
        // Optionally: res.setHeader('Transfer-Encoding', 'chunked');
        ttsRes.body.pipe(res);
      } catch (e) {
        res.status(500).json({ error: 'Gateway error', details: (e as Error).message });
      }
    });

    app.post('/webhook/twilio/:agent_id', async (req, res) => {
      const agentId = req.params.agent_id;
      const { CallSid, From, To } = req.body;

      // 1. Insérer une ligne dans la table 'calls'
      try {
        await supabase.from('calls').insert([
          {
            agent_id: agentId,
            call_sid: CallSid,
            from: From,
            to: To,
            status: 'in_progress',
            source: 'inbound',
            started_at: new Date().toISOString(),
          },
        ]);
      } catch (e) {
        // On ignore l'erreur pour ne pas bloquer le TwiML
      }

      // 2. Récupérer le dernier message 'agent' avec audio_url
      let lastAgentMessage = null;
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('content,audio_url')
          .eq('agent_id', agentId)
          .eq('role', 'agent')
          .not('audio_url', 'is', null)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!error && data) lastAgentMessage = data;
      } catch (e) {
        // ignore
      }

      // 3. Réponse TwiML
      let twiml;
      if (lastAgentMessage && lastAgentMessage.audio_url) {
        twiml = `<Response><Play>${lastAgentMessage.audio_url}</Play></Response>`;
      } else {
        twiml = `<Response><Say>Bonjour, je suis votre agent Allo Koli</Say></Response>`;
      }

      res.set('Content-Type', 'text/xml');
      res.send(twiml);
    });

    app.listen(port, () => {
      console.log(`Gateway listening on http://localhost:${port}`);
      console.log(`Swagger docs available at http://localhost:${port}/docs`);
    });
  })
  .catch((e) => {
    console.error('Failed to initialize OpenAPI Validator:', e);
  });
