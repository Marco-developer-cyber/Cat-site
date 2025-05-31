import { useState, useEffect } from 'react';
import { fetchCats, fetchBreeds } from '../api/catApi';

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
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
      }}>
        <div style={{
          animation: 'pulse 1.5s infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' }
          }
        }}>
          Загрузка...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #FF6B6B, #FF8E8E)',
        color: 'white',
        fontSize: '1.5rem',
        textAlign: 'center',
        padding: '20px'
      }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1400px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          color: '#2c3e50',
          marginBottom: '0.5rem',
          textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
          fontFamily: "'Segoe UI', sans-serif",
          fontWeight: '800',
          background: 'linear-gradient(45deg, #2c3e50, #3498db)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Галерея кошек
        </h1>

        <div style={{
          width: '150px',
          height: '6px',
          background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4)',
          margin: '0 auto 20px',
          borderRadius: '3px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }} />

        <div style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <select
            value={selectedBreed}
            onChange={(e) => setSelectedBreed(e.target.value)}
            style={{
              padding: '12px 25px',
              fontSize: '1.1rem',
              borderRadius: '25px',
              border: '2px solid #4ECDC4',
              background: 'white',
              color: '#2c3e50',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              minWidth: '200px'
            }}
          >
            <option value="">Все породы</option>
            {breeds.map((breed) => (
              <option key={breed.id} value={breed.id}>
                {breed.name}
              </option>
            ))}
          </select>

          <button 
            onClick={loadCats}
            style={{
              padding: '12px 30px',
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
            }}
          >
            Обновить
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '1400px',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        {cats.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => setSelectedCat(cat)}
            style={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              transform: 'perspective(1000px) rotateX(0deg)',
              aspectRatio: '1'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(5deg) translateY(-10px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden'
            }}>
              <img 
                src={cat.url} 
                alt={cat.breeds?.[0]?.name || 'Cat'} 
                style={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                padding: '20px',
                color: 'white',
                transform: 'translateY(100%)',
                transition: 'transform 0.3s ease'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                  {cat.breeds?.[0]?.name || 'Кошка'}
                </h3>
                <p style={{ margin: '5px 0 0', fontSize: '0.9rem', opacity: 0.8 }}>
                  {cat.breeds?.[0]?.temperament || 'Нажмите для просмотра'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCat && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedCat(null)}
        >
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '15px',
            maxWidth: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            width: '100%',
            maxWidth: '800px'
          }}>
            <img 
              src={selectedCat.url} 
              alt={selectedCat.breeds?.[0]?.name || 'Cat'} 
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '60vh',
                objectFit: 'contain',
                borderRadius: '10px',
                marginBottom: '20px'
              }}
            />
            {selectedCat.breeds?.[0] && (
              <div style={{ color: '#2c3e50' }}>
                <h2 style={{ margin: '0 0 10px' }}>{selectedCat.breeds[0].name}</h2>
                <p style={{ margin: '0 0 10px' }}>
                  <strong>Темперамент:</strong> {selectedCat.breeds[0].temperament}
                </p>
                <p style={{ margin: '0 0 10px' }}>
                  <strong>Происхождение:</strong> {selectedCat.breeds[0].origin}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Описание:</strong> {selectedCat.breeds[0].description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CatGallery; 