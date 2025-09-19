
export interface ArtworkDetails {
  artist: string;
  date: string;
  place: string;
  objectType: string;
  systemNumber: string;
}

export interface Message {
  id: string;
  author: 'user' | 'ai';
  image?: string; // base64 data URL for user's uploaded image
  text?: string;  // For AI's haiku, user's reflection, or Artwork title
  artworkDetails?: ArtworkDetails; // For storing V&A API metadata
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  currentArtwork: { base64Image: string; mimeType: string } | null;
}
