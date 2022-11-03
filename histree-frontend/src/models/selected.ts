export type Url = string;

export interface Selected {
  name: string;
  image?: Url;
  attributes?: Record<string, string>;
  description?: string;
  links?: Record<string, Url>;
}
