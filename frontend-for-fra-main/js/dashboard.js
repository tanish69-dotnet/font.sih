// === dashboard.js ===
// Manages the dashboard UI, charts, and statistics.

const Dashboard = (() => {
    // Initializes the dashboard module
    const init = () => {
        console.log("Initializing Dashboard Module...");
        // Load stats and create charts when the module is initialized
        loadDashboardStats();
        createCharts();
    };

    // Fetches data and populates the statistic cards
    const loadDashboardStats = async () => {
        const data = await DataService.getFraData();
        if (!data || !data.claims) return;

        const claims = data.claims;
        const totalClaims = claims.length;
        const approved = claims.filter(c => c.status === 'Approved').length;
        const pending = claims.filter(c => c.status === 'Pending').length;
        const rejected = claims.filter(c => c.status === 'Rejected').length;
        
        // Update the HTML elements with the calculated stats
        document.getElementById('total-claims-stat').textContent = totalClaims;
        document.getElementById('approved-claims-stat').textContent = approved;
        document.getElementById('pending-claims-stat').textContent = pending;
        document.getElementById('rejected-claims-stat').textContent = rejected;
    };

    // Creates all the charts for the dashboard
    const createCharts = async () => {
        const data = await DataService.getFraData();
        if (!data || !data.claims) return;
        
        createClaimsByStateChart(data.claims);
        createStatusDistributionChart(data.claims);
        createMonthlyTrendsChart(); // Using simulated data for this one
    };

    // Bar Chart: Claims by State
    const createClaimsByStateChart = (claims) => {
        const ctx = document.getElementById('claimsByStateChart').getContext('2d');
        
        // Process data: count claims per state
        const claimsByState = claims.reduce((acc, claim) => {
            acc[claim.state] = (acc[claim.state] || 0) + 1;
            return acc;
        }, {});

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(claimsByState),
                datasets: [{
                    label: '# of Claims',
                    data: Object.values(claimsByState),
                    backgroundColor: 'rgba(13, 110, 253, 0.7)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: { y: { beginAtZero: true } },
                responsive: true
            }
        });
    };

    // Pie Chart: Status Distribution
    const createStatusDistributionChart = (claims) => {
        const ctx = document.getElementById('statusDistributionChart').getContext('2d');
        
        const approved = claims.filter(c => c.status === 'Approved').length;
        const pending = claims.filter(c => c.status === 'Pending').length;
        const rejected = claims.filter(c => c.status === 'Rejected').length;

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Approved', 'Pending', 'Rejected'],
                datasets: [{
                    label: 'Claim Status',
                    data: [approved, pending, rejected],
                    backgroundColor: [
                        'rgba(25, 135, 84, 0.7)',  // Success
                        'rgba(255, 193, 7, 0.7)',   // Warning
                        'rgba(220, 53, 69, 0.7)'    // Danger
                    ],
                    borderColor: ['#fff'],
                    borderWidth: 2
                }]
            },
            options: { responsive: true }
        });
    };
    
    // Line Chart: Monthly Trends (with simulated data)
    const createMonthlyTrendsChart = () => {
        const ctx = document.getElementById('monthlyTrendsChart').getContext('2d');
        
        // Note: Our sample data is not time-series. We'll simulate monthly data for demonstration.
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
        const dataPoints = [12, 19, 8, 15, 11, 14, 22, 25];

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: 'Claims Submitted',
                    data: dataPoints,
                    fill: false,
                    borderColor: 'rgba(13, 110, 253, 1)',
                    tension: 0.1
                }]
            },
            options: { responsive: true }
        });
    };

    return {
        init
    };
})();