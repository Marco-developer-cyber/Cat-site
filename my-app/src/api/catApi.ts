const CAT_API_KEY = 'REPLACE_ME';
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

export const fetchBreeds = async (): Promise<Breed[]> => {
  try {
    const response = await fetch('https://api.thecatapi.com/v1/breeds');
    if (!response.ok) {
      throw new Error('Failed to fetch breeds');
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
      ? `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}`
      : 'https://api.thecatapi.com/v1/images/search?limit=10';
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch cats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cats:', error);
    throw error;
  }
};

export const fetchBreedInfo = async (breedId: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/breeds/${breedId}?api_key=${CAT_API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch breed info');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching breed info:', error);
    throw error;
  }
}; 