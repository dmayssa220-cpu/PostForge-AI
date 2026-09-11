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

export type GenerationStatus = 'draft' | 'scheduled' | 'published';

export interface GenerationResponse {
  id: string;
  topic: string;
  contentType: string;
  language: string;
  tone: string;
  status: GenerationStatus;
  scheduledDate: string | null;
  publishedDate: string | null;
  rawOutput: CarouselOutput;
  editedOutput: CarouselOutput | null;
  createdAt: string;
}

export interface ScheduleRequest {
  scheduledDate: string;
}