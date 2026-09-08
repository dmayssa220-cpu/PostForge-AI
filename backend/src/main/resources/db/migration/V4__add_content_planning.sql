CREATE TYPE generation_status AS ENUM ('draft', 'scheduled', 'published');

ALTER TABLE generations ADD COLUMN status generation_status NOT NULL DEFAULT 'draft';
ALTER TABLE generations ADD COLUMN scheduled_date TIMESTAMP;
ALTER TABLE generations ADD COLUMN published_date TIMESTAMP;

CREATE INDEX idx_generations_scheduled_date ON generations(scheduled_date);