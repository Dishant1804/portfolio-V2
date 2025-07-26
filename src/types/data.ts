export interface Experience {
  id: string;
  title: string;
  company: string;
  link: string;
  timeline: string;
  imgsrc: string;
}

export interface Project {
  title: string;
  category: string[];
  description: string;
  link: string;
}

export interface Skill {
  name: string;
  icon: string;
}

export interface BlacklistPR {
  repo: string;
  number: number;
}
