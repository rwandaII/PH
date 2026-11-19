export interface SiteInfo {
  programName: string;
  tagline: string;
  heroText: string;
  mission: string;
  vision: string;
  aboutText: string;
  contactEmail: string;
  phone: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
}

export interface NewsSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: string | null;
}

export interface NewsItem extends NewsSummary {
  content: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = "planned" | "ongoing" | "completed";

export interface ProjectSummary {
  id: number;
  title: string;
  slug: string;
  summary: string;
  coverImage: string | null;
  location: string;
  status: ProjectStatus;
}

export interface Project extends ProjectSummary {
  content: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  slug: string | null;
  role: string;
  bio: string;
  email: string;
  phone: string;
  address: string;
  /** Comma-separated areas of work. */
  expertise: string;
  languages: string;
  education: string;
  joinedYear: number | null;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  whatsapp: string;
  photo: string | null;
  sortOrder: number;
}

/** An approved reader comment, as the public site gets it. */
export interface NewsComment {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

/** A comment as staff see it in the dashboard. */
export interface AdminComment extends NewsComment {
  isApproved: boolean;
  news: { title: string; slug: string };
}

/** One story or project and all of its photos (the Gallery page). */
export interface GalleryAlbum {
  kind: "news" | "project";
  title: string;
  text: string;
  href: string;
  date: string | null;
  photos: string[];
}

export interface Partner {
  id: number;
  name: string;
  logo: string | null;
  websiteUrl: string;
  description: string;
  sortOrder: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  createdAt?: string;
}
