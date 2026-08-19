import json
import os

from google import genai
from fastapi import FastAPI, HTTPException
from pydantic import ValidationError

from models import GenerationRequest, CarouselResponse

app = FastAPI(title="PostForge AI - Microservice IA")

client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

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

    response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=prompt,
)

    raw_text = response.text.strip()

    # Gemini peut parfois entourer le JSON de ```json ... ``` malgré la consigne
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.startswith("json"):
            raw_text = raw_text[4:].strip()

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