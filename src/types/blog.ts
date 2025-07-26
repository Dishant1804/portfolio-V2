export interface Post {
  slug: string;
  content: string;
  title: string;
  date: string;
  description?: string;
  excerpt?: string;
  author?: string;
  headings?: Heading[];
  [key: string]: any;
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export interface MarkdownResult {
  html: string;
  headings: Heading[];
}

export interface NavigationPost {
  title: string;
  slug: string;
}

export interface NavigationPost {
  title: string;
  slug: string;
}
