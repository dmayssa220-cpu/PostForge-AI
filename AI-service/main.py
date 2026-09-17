import json
import os
import time

from google import genai
from google.genai import errors
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import ValidationError
from models import GenerationRequest, CarouselResponse, TranslateRequest, TranslatedCarouselResponse
from fastapi import UploadFile, File, Form
from google.genai import types

app = FastAPI(title="PostForge AI - Microservice IA")

load_dotenv()
gemini_api_key = os.environ.get("GEMINI_API_KEY")
client = genai.Client(api_key=gemini_api_key) if gemini_api_key else None


def get_gemini_client():
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY est manquante. Ajoutez-la dans le fichier .env puis redémarrez le service.",
        )
    return client

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
    gemini_client = get_gemini_client()
    prompt = CAROUSEL_SYSTEM_PROMPT.format(
        tone=request.tone, language=request.language, topic=request.topic
    )

    response = gemini_client.models.generate_content(
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
    gemini_client = get_gemini_client()
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

    response = gemini_client.models.generate_content(
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
    
@app.post("/internal/v1/transcribe/audio")
async def transcribe_audio(file: UploadFile = File(...), language: str = Form("fr")):
    gemini_client = get_gemini_client()
    audio_bytes = await file.read()
    mime_type = file.content_type or "audio/webm"

    prompt = (
        f"Transcris fidèlement cet enregistrement audio en texte, dans la langue parlée "
        f"(probablement {language}). Réponds UNIQUEMENT avec le texte transcrit brut, "
        f"sans commentaire, sans guillemets, sans ponctuation de balisage."
    )

    try:
        for attempt in range(3):
            try:
                response = gemini_client.models.generate_content(
                    model="gemini-3.6-flash",
                    contents=[
                        types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                        prompt,
                    ],
                )
                break
            except errors.ServerError as error:
                if error.code != 503 or attempt == 2:
                    raise
                time.sleep(1 + attempt)
    except errors.ServerError as error:
        raise HTTPException(
            status_code=503,
            detail="Le modèle Gemini est temporairement indisponible. Réessayez dans quelques instants.",
        ) from error

    return {"transcript": response.text.strip()}    