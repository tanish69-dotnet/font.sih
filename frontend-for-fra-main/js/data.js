// === data.js ===
// Handles data fetching and management (API communication).

const DataService = (() => {
    // API Communication Setup
    const API_BASE_URL = 'assets/data/'; // Using local data for now

    /**
     * Fetches FRA sample data from the JSON file.
     * @returns {Promise<Object>} A promise that resolves to the JSON data.
     */
    const getFraData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}fra-sample-data.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch FRA data:', error);
            return null;
        }
    };

    return {
        getFraData
    };
})();