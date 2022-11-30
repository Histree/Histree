import { NodeId } from "./graphInfo";

export type Url = string;

export interface Selected {
  article: Url;
  id: NodeId;
  name: string;
  image?: Url;
  attributes?: Record<string, string>;
  description?: string;
}
