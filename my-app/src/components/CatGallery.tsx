import { useState, useEffect } from 'react';
import { fetchCats, fetchBreeds } from '../api/catApi';
import './CatGallery.css';

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

const CatGallery = () => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

  const loadBreeds = async () => {
    try {
      const data = await fetchBreeds();
      setBreeds(data);
    } catch (error) {
      console.error('Error loading breeds:', error);
      setError('Не удалось загрузить список пород');
    }
  };

  const loadCats = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCats(selectedBreed);
      console.log('Loaded cats:', data);
      setCats(data);
    } catch (error) {
      console.error('Error loading cats:', error);
      setError('Не удалось загрузить фотографии кошек');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBreeds();
  }, []);

  useEffect(() => {
    loadCats();
  }, [selectedBreed]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="pulse">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        {error}
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="header">
        <h1>Галерея кошек</h1>
        <div className="divider" />
        <div className="controls">
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
          >
            <option value="">Все породы</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>
          <button onClick={loadCats}>Обновить</button>
        </div>
      </div>
      <div className="cat-grid">
        {cats.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => setSelectedCat(cat)}
            className="cat-card"
          >
            <div>
              <img 
                src={cat.url} 
                alt={cat.breeds?.[0]?.name || 'Cat'} 
              />
              <div className="info">
                <h3>{cat.breeds?.[0]?.name || 'Кошка'}</h3>
                <p>{cat.breeds?.[0]?.temperament || 'Нажмите для просмотра'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedCat && (
        <div 
          className="modal"
          onClick={() => setSelectedCat(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedCat.url} 
              alt={selectedCat.breeds?.[0]?.name || 'Cat'} 
            />
            {selectedCat.breeds?.[0] && (
              <div>
                <h2>{selectedCat.breeds[0].name}</h2>
                <p><strong>Темперамент:</strong> {selectedCat.breeds[0].temperament}</p>
                <p><strong>Происхождение:</strong> {selectedCat.breeds[0].origin}</p>
                <p><strong>Описание:</strong> {selectedCat.breeds[0].description}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatGallery;