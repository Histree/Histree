export type Url = string;

export interface Selected {
  article: Url;
  name: string;
  image?: Url;
  attributes?: Record<string, string>;
  description?: string;
}
