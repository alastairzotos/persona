import { PublicConfig } from '@bitmetro/persona-types';

export const fetchConfig = async (apiUrl: string): Promise<PublicConfig> => {
  const res = await fetch(`${apiUrl}/persona/public-config`);
  return await res.json();
}
