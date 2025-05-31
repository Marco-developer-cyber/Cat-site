const CAT_API_KEY = 'live_B3XDba5VxEboJRpU78SZpPGEed5xFoKVrF5WvMqyndhzjstzBPJ0WDuH4bcaTEoX';
const BASE_URL = 'https://api.thecatapi.com/v1';

interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: Breed[];
}

interface Breed {
  id: string;
  name: string;
  temperament: string;
  origin: string;
  description: string;
}

const headers = {
  'x-api-key': CAT_API_KEY,
};

export const fetchBreeds = async (): Promise<Breed[]> => {
  try {
    const response = await fetch(`${BASE_URL}/breeds`, { headers });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch breeds:', response.status, errorText);
      throw new Error(`Failed to fetch breeds: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching breeds:', error);
    throw error;
  }
};

export const fetchCats = async (breedId?: string): Promise<Cat[]> => {
  try {
    const url = breedId 
      ? `${BASE_URL}/images/search?limit=10&breed_ids=${breedId}`
      : `${BASE_URL}/images/search?limit=10`;
    
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch cats:', response.status, errorText);
      throw new Error(`Failed to fetch cats: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cats:', error);
    throw error;
  }
};

export const fetchBreedInfo = async (breedId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/breeds/${breedId}`, { headers });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch breed info:', response.status, errorText);
      throw new Error(`Failed to fetch breed info: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching breed info:', error);
    throw error;
  }
};