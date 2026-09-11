import json
import os

from google import genai
from fastapi import FastAPI, HTTPException
from pydantic import ValidationError
from models import GenerationRequest, CarouselResponse, TranslateRequest, TranslatedCarouselResponse


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

LANGUAGE_NAMES = {
    "fr": "français",
    "en": "anglais",
    "ar": "arabe",
    "de": "allemand",
}

TRANSLATE_SYSTEM_PROMPT = """Tu es un traducteur professionnel spécialisé dans le contenu LinkedIn.
Traduis intégralement le carrousel suivant en {target_language_name}, en conservant :
- Le même nombre de slides
- Le même ton et style (accroche, structure, appel à l'action)
- Les hashtags adaptés à la langue cible (traduits ou équivalents culturels pertinents)

Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après, sans balises markdown,
selon exactement ce schéma :

{{
  "slides": [
    {{"slide_number": 1, "title": "...", "content": "..."}},
    ...
  ],
  "cta_slide": "...",
  "suggested_hashtags": ["...", "..."]
}}

Contenu original à traduire :
{original_content}
"""


@app.post("/internal/v1/translate/carousel", response_model=TranslatedCarouselResponse)
def translate_carousel(request: TranslateRequest):
    target_language_name = LANGUAGE_NAMES.get(request.target_language, request.target_language)

    original_content = json.dumps({
        "slides": [s.model_dump() for s in request.slides],
        "cta_slide": request.cta_slide,
        "suggested_hashtags": request.suggested_hashtags,
    }, ensure_ascii=False)

    prompt = TRANSLATE_SYSTEM_PROMPT.format(
        target_language_name=target_language_name,
        original_content=original_content,
    )

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    raw_text = response.text.strip()
    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.startswith("json"):
            raw_text = raw_text[4:].strip()

    try:
        data = json.loads(raw_text)
        validated = TranslatedCarouselResponse(**data)
        return validated
    except (json.JSONDecodeError, ValidationError) as e:
        raise HTTPException(
            status_code=502,
            detail=f"La traduction a retourné une sortie invalide: {str(e)}",
        )