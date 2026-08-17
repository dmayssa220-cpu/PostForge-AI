import json
import os

from anthropic import Anthropic
from fastapi import FastAPI, HTTPException
from pydantic import ValidationError

from models import GenerationRequest, CarouselResponse

app = FastAPI(title="PostForge AI - Microservice IA")

client = Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

CAROUSEL_SYSTEM_PROMPT = """Tu es un générateur de contenu structuré pour LinkedIn.
Tu dois répondre UNIQUEMENT avec un JSON valide, sans aucun texte avant ou après,
sans balises markdown, selon ce schéma exact :

{{
  "slides": [
    {{"slide_number": 1, "title": "...", "content": "..."}},
    ... (exactement 7 slides)
  ],
  "cta_slide": "texte d'appel à l'action",
  "suggested_hashtags": ["...", "..."]
}}

Contraintes :
- Exactement 7 slides
- Slide 1 = accroche (hook fort, une question ou une affirmation contre-intuitive)
- Slide 7 = call-to-action (commentaire, partage, suivi)
- Ton : {tone}
- Langue : {language}
- Sujet : {topic}
"""


@app.post("/internal/v1/generate/carousel", response_model=CarouselResponse)
def generate_carousel(request: GenerationRequest):
    prompt = CAROUSEL_SYSTEM_PROMPT.format(
        tone=request.tone, language=request.language, topic=request.topic
    )

    message = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    raw_text = message.content[0].text

    try:
        data = json.loads(raw_text)
        validated = CarouselResponse(**data)
        return validated
    except (json.JSONDecodeError, ValidationError) as e:
        raise HTTPException(
            status_code=502,
            detail=f"Le LLM a retourné une sortie invalide: {str(e)}",
        )


@app.get("/health")
def health():
    return {"status": "ok"}