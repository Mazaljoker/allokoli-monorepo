import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, Application } from "express";
import { createClient } from "@supabase/supabase-js";

const app: Application = express();
const port = process.env.PORT || 3000;

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

app.post("/webhook/twilio/recording", async (req: Request, res: Response) => {
  const { CallSid, RecordingUrl, RecordingDuration } = req.body;

  if (!CallSid || !RecordingUrl || !RecordingDuration) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Met à jour la ligne dans la table 'calls'
  const { error } = await supabase
    .from("calls")
    .update({
      status: "completed",
      audio_url: RecordingUrl,
      duration_sec: Number(RecordingDuration),
    })
    .eq("twilio_sid", CallSid);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ success: true });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
