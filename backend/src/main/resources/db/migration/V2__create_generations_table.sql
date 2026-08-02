CREATE TYPE content_type AS ENUM ('carousel', 'post', 'poll');

CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    topic VARCHAR(500) NOT NULL,
    content_type content_type NOT NULL,
    language VARCHAR(2) NOT NULL DEFAULT 'fr',
    tone VARCHAR(50) NOT NULL DEFAULT 'expert',
    raw_output JSONB,
    edited_output JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_generations_user_id ON generations(user_id);
