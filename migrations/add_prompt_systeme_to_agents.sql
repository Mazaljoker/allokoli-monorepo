-- Ajoute la colonne prompt_systeme à la table agents
ALTER TABLE agents
ADD COLUMN prompt_systeme text NULL;

COMMENT ON COLUMN agents.prompt_systeme IS 'prompt système défini par le créateur de l’agent';
