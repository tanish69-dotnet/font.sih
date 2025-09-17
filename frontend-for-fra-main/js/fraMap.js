// === fraMap.js ===
// Manages the Leaflet map, layers, and interactions.

const FraMap = (() => { 
    let mapInstance = null;
    let mapInitialized = false;

    // Initializes the map module
    const init = () => {
        console.log("Initializing FraMap Module...");
    };

    // Creates the Leaflet map instance
    const createMap = () => {
        if (mapInitialized) return;

        console.log("Creating map instance with layers...");
        
        // Define different map layers
        const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });

        const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        });

        // Initialize the map with a default layer
        mapInstance = L.map('map-container', {
            center: [20.5937, 78.9629],
            zoom: 5,
            layers: [streetMap] // Set Street Map as the default
        });

        // Create the layer control to switch between views
        const baseMaps = {
            "Street Map": streetMap,
            "Satellite View": satelliteMap
        };
        L.control.layers(baseMaps).addTo(mapInstance);
        
        loadFraClaims();
        mapInitialized = true;

        // FIX: Tell the map to resize itself to solve rendering issues
        setTimeout(() => mapInstance.invalidateSize(), 100);
    };

    // Fetches FRA data and adds markers to the map
    const loadFraClaims = async () => {
        const data = await DataService.getFraData();
        if (!data || !data.claims) {
            console.error("Could not load FRA claims data.");
            return;
        }

        console.log("Plotting FRA claims on the map...");
        data.claims.forEach(claim => {
            if (claim.location && claim.location.lat && claim.location.lon) {
                const marker = L.marker([claim.location.lat, claim.location.lon]).addTo(mapInstance);
                
                // Create a popup with claim details
                const popupContent = `
                    <div class="map-popup">
                        <strong>Claim ID:</strong> ${claim.claimId}<br>
                        <strong>Applicant:</strong> ${claim.applicantName}<br>
                        <strong>Type:</strong> ${claim.claimType}<br>
                        <strong>Status:</strong> <span class="status-${claim.status.toLowerCase()}">${claim.status}</span><br>
                        <strong>Area:</strong> ${claim.areaClaimedHectares} ha
                    </div>
                `;
                marker.bindPopup(popupContent);
            }
        });
    };

    return {
        init,
        createMap
    };
})();