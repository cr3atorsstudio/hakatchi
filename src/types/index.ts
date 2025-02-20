export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface Grave {
  id: string;
  user_id: string;
  name: string;
  location: string;
  created_at: string;
  dirtiness: number; // 0-100 (0=綺麗, 100=非常に汚い)
  hunger: number; // 0-100 (0=満腹, 100=飢餓状態)
  last_updated: string;
}

export interface CleaningLog {
  id: string;
  user_id: string;
  grave_id: string;
  cleaned_at: string;
  effort_level: number; // 1-10
  onchain_impact: boolean;
  onchain_tx_id?: string; // オプション: トランザクションID
}

export interface FeedingLog {
  id: string;
  user_id: string;
  grave_id: string;
  fed_at: string;
  food_quality: number; // 1-10
  onchain_tx_id?: string; // オプション: トランザクションID
} 