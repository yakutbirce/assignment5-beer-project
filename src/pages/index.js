
import { useEffect, useState, useMemo, useCallback } from 'react';
import { fetchBeers } from '../../utils/api';
import { useRouter } from 'next/router';

export default function Home() {
  const [beers, setBeers] = useState([]);
  const [selectedBeer, setSelectedBeer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // useMemo kullanarak filtrelenmiş bira listesi önbelleğe alındı
  const filteredBeers = useMemo(() => {
    return beers.filter((beer) =>
      beer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [beers, searchTerm]);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchBeers();
      setBeers(data);
      setLoading(false);
    };

    getData();
  }, []);

  // useCallback kullanarak handleSearch fonksiyonu önbelleğe alındı
  const handleSearch = useCallback(() => {
    setBeers(filteredBeers);
  }, [filteredBeers]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBeerDetail = async (id) => {
    try {
      const response = await fetch(`https://api.sampleapis.com/beers/ale/${id}`);
      const data = await response.json();
      setSelectedBeer(data);

      router.push(`/beer/${id}`);
      localStorage.setItem('selectedBeer', JSON.stringify(data));
    } catch (error) {
      console.error('Error fetching beer details:', error);
    }
  };

  return (
    <div>
      <h1>Ale Beers</h1>

      <div>
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {filteredBeers.map((beer) => (
            <li key={beer.id}>
              {beer.name}{' '}
              <button onClick={() => handleBeerDetail(beer.id)}>Show Details</button>
            </li>
          ))}
        </ul>
      )}

      {selectedBeer && (
        <div>
          <h2>Selected Beer Details</h2>
          <p>Name: {selectedBeer.name}</p>
          <p>Description: {selectedBeer.description}</p>
        </div>
      )}
    </div>
  );
}
