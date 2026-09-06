export interface GenerationRequest {
  topic: string;
  language: string;
  tone: string;
}

export interface Slide {
  slideNumber: number;
  title: string;
  content: string;
}

export interface CarouselOutput {
  slides: Slide[];
  ctaSlide: string;
  suggestedHashtags: string[];
}

export interface GenerationResponse {
  id: string;
  topic: string;
  contentType: string;
  language: string;
  tone: string;
  rawOutput: CarouselOutput;
  editedOutput: CarouselOutput | null;
  createdAt: string;
}