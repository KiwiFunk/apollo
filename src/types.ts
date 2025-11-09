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

export interface DbNote {
    slug: string;
    title: string;
    description: string;
    publish_date: string;
    category: string;
    content: string;
}

export type AppNote = {
    url: string;
    frontmatter: Frontmatter;
    file: string;
    rawContent: () => string;
};
