import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = 3000;

const supabaseUrl = "https://xyzcompany.supabase.co";
const supabaseKey = "public-anon-key";
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());

app.post("/api/agent", async (req, res) => {
  const { nom, secteur_activite, ton, langue, prompt_systeme } = req.body;

  const { data, error } = await supabase.from("agents").insert([
    {
      nom,
      secteur_activite,
      ton,
      langue,
      prompt_systeme,
    },
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
