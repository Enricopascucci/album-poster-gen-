export interface Track {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  artists: {
    name: string;
  }[];
}

export interface Album {
  id: string;
  name: string;
  artists: {
    name: string;
  }[];
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  release_date: string;
  total_tracks: number;
  external_urls: {
    spotify: string;
  };
  tracks?: {
    items: Track[];
  };
  label?: string;
  copyrights?: {
    text: string;
    type: string;
  }[];
}

export interface AlbumSearchResponse {
  albums: {
    items: Album[];
    total: number;
  };
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
