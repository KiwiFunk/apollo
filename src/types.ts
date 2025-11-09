// Define shape of note and frontmatter data
export interface Frontmatter {
    title: string;
    description: string;
    publishDate: string;
    category?: string;
}

export interface Note {
  url: string | undefined; // Even though we Normalize, ts still expects glob may return undefined
  frontmatter: {
    title: string;
    publishDate: string;
    [key: string]: any;
  };
}