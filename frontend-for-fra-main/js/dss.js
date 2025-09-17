// === dss.js ===
// Handles the Decision Support System simulation.

const DSS = (() => {
    let claimsData = [];

    // A simple database of government schemes with eligibility rules
    const schemeDatabase = [
        {
            name: 'Pradhan Mantri Kisan Samman Nidhi',
            description: 'Provides income support to all landholding farmer families.',
            isEligible: (claim) => claim.status === 'Approved' && claim.claimType === 'Individual Forest Rights (IFR)'
        },
        {
            name: 'National Bamboo Mission',
            description: 'Promotes the growth of the bamboo sector in forest and non-forest areas.',
            isEligible: (claim) => claim.status === 'Approved' && claim.claimType === 'Community Forest Rights (CFR)' && claim.areaClaimedHectares > 10
        },
        {
            name: 'Jal Jeevan Mission',
            description: 'Aims to provide safe and adequate drinking water through individual household tap connections.',
            isEligible: (claim) => claim.status === 'Approved' && ['Odisha', 'Jharkhand'].includes(claim.state)
        },
        {
            name: 'Urgent Review Protocol',
            description: 'This claim is flagged for urgent review due to its pending status, indicating a potential administrative delay.',
            isEligible: (claim) => claim.status === 'Pending'
        }
    ];

    const init = async () => {
        console.log("Initializing DSS Module...");
        claimsData = (await DataService.getFraData())?.claims || [];
        runAnalysis();
    };

    // Main function to run all DSS analyses
    const runAnalysis = () => {
        const priorityClaims = identifyHighPriorityClaims(claimsData);
        renderPriorityList(priorityClaims);
        
        const alerts = checkForSystemAlerts(claimsData);
        renderAlerts(alerts);
    };

    // Calculates a priority score for a claim
    const calculatePriorityScore = (claim) => {
        let score = 0;
        if (claim.status === 'Pending') score += 50;
        if (claim.status === 'Rejected') score += 25;
        if (claim.claimType === 'Community Forest Rights (CFR)') score += 15;
        if (claim.areaClaimedHectares > 100) score += 10;
        return score;
    };

    // Finds and sorts claims by priority score
    const identifyHighPriorityClaims = (claims) => {
        return claims
            .map(claim => ({ ...claim, score: calculatePriorityScore(claim) }))
            .filter(claim => claim.score > 0)
            .sort((a, b) => b.score - a.score);
    };

    // Renders the list of high-priority claims
    const renderPriorityList = (priorityClaims) => {
        const container = document.getElementById('priority-claims-list');
        if (!container) return;
        
        if (priorityClaims.length === 0) {
            container.innerHTML = '<p>No high-priority claims found.</p>';
            return;
        }

        container.innerHTML = priorityClaims.map(claim => `
            <div class="priority-claim-item">
                <div class="priority-claim-info">
                    <p>${claim.applicantName}</p>
                    <span>${claim.claimId} | <strong>Status:</strong> ${claim.status}</span>
                </div>
                <div class="priority-claim-score">
                    ${claim.score}
                    <span>Priority Score</span>
                </div>
                <button class="btn-details" data-claim-id="${claim.claimId}">View Details</button>
            </div>
        `).join('');

        // Add event listeners to the new buttons
        container.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', (e) => {
                const claimId = e.target.dataset.claimId;
                matchSchemesForClaim(claimId);
            });
        });
    };

    // Generates system-wide alerts based on data
    const checkForSystemAlerts = (claims) => {
        const alerts = [];
        const pendingCount = claims.filter(c => c.status === 'Pending').length;
        if (pendingCount > 0) {
            alerts.push({
                level: 'warning',
                icon: 'fa-clock',
                message: `There are <strong>${pendingCount} claim(s)</strong> with 'Pending' status requiring attention.`
            });
        }
        return alerts;
    };

    // Renders the system alerts
    const renderAlerts = (alerts) => {
        const container = document.getElementById('system-alerts-container');
        if (!container) return;
        container.innerHTML = alerts.map(alert => `
            <div class="alert-card alert-${alert.level}">
                <i class="fas ${alert.icon}"></i>
                <p>${alert.message}</p>
            </div>
        `).join('');
    };

    // Finds and renders scheme matches for a selected claim
    const matchSchemesForClaim = (claimId) => {
        const claim = claimsData.find(c => c.claimId === claimId);
        if (!claim) return;

        const matchedSchemes = schemeDatabase.filter(scheme => scheme.isEligible(claim));
        
        const container = document.getElementById('scheme-matching-container');
        if (!container) return;

        if (matchedSchemes.length === 0) {
            container.innerHTML = '<p>No eligible schemes found for this claim.</p>';
            return;
        }

        container.innerHTML = matchedSchemes.map(scheme => `
            <div class="scheme-suggestion-card">
                <h4>${scheme.name}</h4>
                <p>${scheme.description}</p>
            </div>
        `).join('');
    };

    return {
        init
    };
})();