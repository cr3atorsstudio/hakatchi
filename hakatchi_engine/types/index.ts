export interface StatusChange {
  energy: number;
  cleanliness: number;
  mood: number;
}

export interface BlockchainData {
  action: string;
  tokenId: number;
  timestamp: number;
  changes: StatusChange;
}

export interface GraveStatus {
  energy: number;
  cleanliness: number;
  mood: number;
}

export interface GraveResponse {
  success: boolean;
  id?: string;
  tokenId?: number;
  status?: GraveStatus;
  error?: string;
}
