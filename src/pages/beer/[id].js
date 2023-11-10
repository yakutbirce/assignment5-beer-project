
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function BeerDetail() {
    const [beer, setBeer] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const { id } = router.query;

            if (id) {
                // İlk olarak Local Storage'dan veri alınsın
                const localStorageData = localStorage.getItem('selectedBeer');
                const localStorageBeer = localStorageData ? JSON.parse(localStorageData) : null;

                // Eğer Local Storage'da veri varsa, o kullanılsın.
                if (localStorageBeer) {
                    setBeer(localStorageBeer);
                    setLoading(false);
                } else {
                    try {
                        // Eğer Local Storage'da veri yoksa, API'den veri çekilsin.
                        const response = await fetch(`https://api.sampleapis.com/beers/ale/${id}`);
                        const data = await response.json();
                        setBeer(data);
                        setLoading(false);
                    } catch (error) {
                        console.error('Error fetching beer details:', error);
                    }
                }
            }
        };

        fetchData();
    }, [router.query.id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!beer) {
        return <p>Beer not found</p>;
    }

    return (
        <div>
            <h1>Beer Detail</h1>
            <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', margin: '16px', maxWidth: '400px' }}>
                <img src={beer.image} alt={beer.name} style={{ maxWidth: '100%', marginBottom: '16px', borderRadius: '8px' }} />
                <p>Name: {beer.name}</p>
                <p>Price: {beer.price}</p>
                <p>Rating: {beer.rating.average}</p>
                <p>Reviews: {beer.rating.reviews}</p>
            </div>
        </div>
    );
}
