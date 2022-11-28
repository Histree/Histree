export type Url = string;

export interface Selected {
  name: string;
  image?: Url;
  attributes?: Record<string, string>;
  description?: string;
  links?: Record<string, Url>;
  place_of_birth?: CardLocation;
  place_of_death?: CardLocation;
}

export interface CardLocation {
  article: string;
  coordinate_location: {
    latitude: string,
    longitude: string
  }
  description: string;
  id: string;
  image: string;
  name: string;  
}
