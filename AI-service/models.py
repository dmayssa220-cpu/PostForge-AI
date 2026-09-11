from pydantic import BaseModel, Field
from typing import List, Literal


class GenerationRequest(BaseModel):
    topic: str
    language: Literal["fr", "en"] = "fr"
    tone: Literal["debutant", "expert"] = "expert"


class Slide(BaseModel):
    slide_number: int
    title: str
    content: str


class CarouselResponse(BaseModel):
    slides: List[Slide] = Field(..., min_length=7, max_length=7)
    cta_slide: str
    suggested_hashtags: List[str]


class TranslatedCarouselResponse(BaseModel):
    slides: List[Slide]
    cta_slide: str
    suggested_hashtags: List[str]


class PostVariant(BaseModel):
    style: Literal["educatif", "storytelling", "question_hook"]
    text: str


class PostResponse(BaseModel):
    variants: List[PostVariant]
    suggested_hashtags: List[str]


class TranslateRequest(BaseModel):
    slides: List[Slide]
    cta_slide: str
    suggested_hashtags: List[str]
    target_language: Literal["fr", "en", "ar", "de"]   