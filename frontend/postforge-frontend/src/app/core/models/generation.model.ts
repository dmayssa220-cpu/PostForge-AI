export interface GenerationRequest {
  topic: string;
  language: string;
  tone: string;
}

export interface Slide {
  slide_number: number;
  title: string;
  content: string;
}

export interface CarouselOutput {
  slides: Slide[];
  cta_slide: string;
  suggested_hashtags: string[];
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