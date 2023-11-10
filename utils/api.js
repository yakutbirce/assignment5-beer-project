
const fetchBeers = async () => {
    try {
        const response = await fetch('https://api.sampleapis.com/beers/ale');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching beers:', error);
        return [];
    }
};

export { fetchBeers };
