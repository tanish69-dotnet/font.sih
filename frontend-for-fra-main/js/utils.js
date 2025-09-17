// === utils.js ===
// Contains helper and utility functions used across the application.

const Utils = (() => {
    /**
     * Formats a number with commas as thousands separators.
     * @param {number} num - The number to format.
     * @returns {string} The formatted number string.
     */
    const formatNumber = (num) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };

    /**
     * Formats a date object into a readable string (e.g., "Sep 16, 2025").
     * @param {Date} date - The date object to format.
     * @returns {string} The formatted date string.
     */
    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    };

    return {
        formatNumber,
        formatDate
    };
})();