import { supabase } from './client';
import type { Property, PropertyToken, PropertyWithTokens } from './types';

export async function getProperties(status?: Property['status']): Promise<PropertyWithTokens[]> {
  // Build query
  let query = supabase.from('properties').select('*');

  // Add filters
  if (status) {
    query = query.eq('status', status);
  }

  // Add ordering
  query = query.order('created_at', { ascending: false });

  const { data: properties, error: propertiesError } = await query;

  if (propertiesError) throw propertiesError;

  // Get all tokens for these properties
  const propertyIds = properties.map((p) => p.id);
  const { data: tokens, error: tokensError } = await supabase
    .from('property_tokens')
    .select('*')
    .in('property_id', propertyIds);

  if (tokensError) throw tokensError;

  return properties.map((property) => ({
    ...property,
    tokens: tokens.filter((token) => token.property_id === property.id),
  }));
}

export async function getPropertyById(id: string): Promise<PropertyWithTokens | null> {
  const { data: property, error: propertyError } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (propertyError) throw propertyError;
  if (!property) return null;

  const { data: tokens, error: tokensError } = await supabase
    .from('property_tokens')
    .select('*')
    .eq('property_id', id);

  if (tokensError) throw tokensError;

  return {
    ...property,
    tokens: tokens || [],
  };
}

export async function createProperty(property: Omit<Property, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('properties').insert(property).select().single();

  if (error) throw error;
  return data;
}

export async function createPropertyToken(token: Omit<PropertyToken, 'id'>) {
  const { data, error } = await supabase.from('property_tokens').insert(token).select().single();

  if (error) throw error;
  return data;
}

export async function searchProperties(searchTerm: string): Promise<PropertyWithTokens[]> {
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('*')
    .or(`address.ilike.%${searchTerm}%,metadata_uri.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (propertiesError) throw propertiesError;

  const { data: tokens, error: tokensError } = await supabase.from('property_tokens').select('*');

  if (tokensError) throw tokensError;

  return properties.map((property) => ({
    ...property,
    tokens: tokens.filter((token) => token.property_id === property.id),
  }));
}

export async function incrementTokenSupply(tokenId: number) {
  // First get the current supply
  const { data: currentData, error: fetchError } = await supabase
    .from('property_tokens')
    .select('current_supply')
    .eq('token_id', tokenId)
    .single();

  console.log('currentData', currentData);
  if (fetchError) throw fetchError;

  // Then increment it
  const { error: updateError } = await supabase
    .from('property_tokens')
    .update({ current_supply: currentData?.current_supply + 1 })
    .eq('token_id', tokenId)
    .select();

  if (updateError) throw updateError;
}
