export type ContentCategory = 'episode' | 'moment' | 'milestone';

export interface EpisodeDetail {
  id: string;
  chapterNumber: number;
  title: string;
  tamilTitle?: string;
  duration: string;
  synopsis: string;
  detailedStory: string;
  thumbnail: string;
  gallery?: string[];
  location?: string;
  memoryDate?: string;
  videoSource?: string;
}

export interface ContentItem {
  id: string;
  chapterNumber?: number;
  title: string;
  tamilTitle?: string;
  synopsis: string;
  detailedStory?: string;
  backdrop: string;
  poster: string;
  gallery?: string[];
  videoSource?: string;
  fallbackVideo?: string;
  releaseYear: number;
  memoryDate?: string;
  location?: string;
  maturityRating: string;
  qualityBadge: string;
  audioBadge?: string;
  duration: string;
  matchScore: number;
  category: ContentCategory;
  genres: string[];
  tags: string[];
  cast: string[];
  creator: string;
  featured?: boolean;
  isTop10?: number;
  progress?: number; // 0 to 100 for Continue Watching
  episodes?: EpisodeDetail[];
  similarIds?: string[];
}

export type ActiveTab = 'home' | 'chapters' | 'milestones' | 'soundtrack' | 'promise' | 'my-list';

export interface MilestoneItem {
  id: string;
  stepNumber: number;
  date: string;
  title: string;
  tamilTitle: string;
  location: string;
  description: string;
  image: string;
  targetEpisodeId: string;
  quote?: string;
}
