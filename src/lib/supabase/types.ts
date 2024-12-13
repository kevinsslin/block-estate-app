export interface Property {
  id: string;
  created_at: string;
  address: string;
  metadata_uri: string;
  image_url: string;
  quote_asset: string;
  start_timestamp: string;
  owner_address: string;
  contract_address: string;
  status: 'pending' | 'active' | 'sold';
}

export interface PropertyToken {
  id: string;
  property_id: string;
  token_id: number;
  price: string;
  max_supply: number;
  current_supply: number;
  token_type: string;
  description: string;
}

export type PropertyWithTokens = Property & {
  tokens: PropertyToken[];
};
