ALTER TABLE fichas_medicas ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_fichas_medicas_activo ON fichas_medicas(activo);
