// === claims.js ===
// Handles the Claims Management page functionality.

const Claims = (() => {
    // State for the claims page
    const state = {
        allClaims: [],
        filteredClaims: [],
        currentPage: 1,
        rowsPerPage: 5,
        sortColumn: null,
        sortDirection: 'asc'
    };

    const init = async () => {
        console.log("Initializing Claims Module...");
        state.allClaims = (await DataService.getFraData())?.claims || [];
        state.filteredClaims = state.allClaims;
        
        setupEventListeners();
        renderTable();
    };
    
    const setupEventListeners = () => {
        document.getElementById('claims-search-input')?.addEventListener('input', handleFilterChange);
        document.getElementById('claims-status-filter')?.addEventListener('input', handleFilterChange);
        document.getElementById('claims-type-filter')?.addEventListener('input', handleFilterChange);
        
        document.getElementById('action-modal')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay') || e.target.classList.contains('modal-close-btn')) {
                closeModal();
            }
        });
    };
    
    const handleFilterChange = () => {
        const searchTerm = document.getElementById('claims-search-input').value.toLowerCase();
        const statusFilter = document.getElementById('claims-status-filter').value;
        const typeFilter = document.getElementById('claims-type-filter').value;

        state.filteredClaims = state.allClaims.filter(claim => {
            const searchMatch = claim.applicantName.toLowerCase().includes(searchTerm) || claim.claimId.toLowerCase().includes(searchTerm);
            const statusMatch = (statusFilter === 'all') || (claim.status === statusFilter);
            const typeMatch = (typeFilter === 'all') || (claim.claimType === typeFilter);
            return searchMatch && statusMatch && typeMatch;
        });
        
        state.currentPage = 1; // Reset to first page after filtering
        renderTable();
    };

    const renderTable = () => {
        const tableBody = document.querySelector('#claims-table tbody');
        const tableHead = document.querySelector('#claims-table thead');
        if (!tableBody || !tableHead) return;

        // Render headers
        tableHead.innerHTML = `
            <tr>
                <th data-column="claimId">Claim ID</th>
                <th data-column="applicantName">Applicant Name</th>
                <th data-column="state">State</th>
                <th data-column="status">Status</th>
                <th>Actions</th>
            </tr>
        `;
        
        // Paginate data
        const startIndex = (state.currentPage - 1) * state.rowsPerPage;
        const endIndex = startIndex + state.rowsPerPage;
        const pageData = state.filteredClaims.slice(startIndex, endIndex);

        // Render rows
        tableBody.innerHTML = pageData.map(claim => `
            <tr>
                <td>${claim.claimId}</td>
                <td>${claim.applicantName}</td>
                <td>${claim.state}</td>
                <td>${claim.status}</td>
                <td class="actions-cell">
                    <button class="btn-details" onclick="Claims.openModal('view', '${claim.claimId}')">View</button>
                    <button class="btn-details" onclick="alert('Edit action for ${claim.claimId}')">Edit</button>
                </td>
            </tr>
        `).join('');

        renderPagination();
    };

    const renderPagination = () => {
        const container = document.getElementById('pagination-controls');
        const totalPages = Math.ceil(state.filteredClaims.length / state.rowsPerPage);
        
        let buttonsHTML = `<button onclick="Claims.changePage(${state.currentPage - 1})" ${state.currentPage === 1 ? 'disabled' : ''}>&laquo; Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            buttonsHTML += `<button onclick="Claims.changePage(${i})" class="${i === state.currentPage ? 'active' : ''}">${i}</button>`;
        }
        buttonsHTML += `<button onclick="Claims.changePage(${state.currentPage + 1})" ${state.currentPage === totalPages ? 'disabled' : ''}>Next &raquo;</button>`;
        
        container.innerHTML = buttonsHTML;
    };
    
    const changePage = (newPage) => {
        const totalPages = Math.ceil(state.filteredClaims.length / state.rowsPerPage);
        if (newPage < 1 || newPage > totalPages) return;
        state.currentPage = newPage;
        renderTable();
    };

    const openModal = (type, claimId) => {
        const claim = state.allClaims.find(c => c.claimId === claimId);
        if (!claim) return;
        
        const modal = document.getElementById('action-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = `Claim Details: ${claim.claimId}`;
        modalBody.innerHTML = `
            <div class="detail-grid">
                <p><strong>Applicant:</strong></p><p>${claim.applicantName}</p>
                <p><strong>State:</strong></p><p>${claim.state}</p>
                <p><strong>District:</strong></p><p>${claim.district}</p>
                <p><strong>Claim Type:</strong></p><p>${claim.claimType}</p>
                <p><strong>Area (ha):</strong></p><p>${claim.areaClaimedHectares.toFixed(2)}</p>
                <p><strong>Status:</strong></p><p>${claim.status}</p>
                <p><strong>Submitted:</strong></p><p>${new Date(claim.submissionDate).toLocaleDateString()}</p>
            </div>
        `;
        
        modal.classList.add('show');
    };

    const closeModal = () => {
        document.getElementById('action-modal').classList.remove('show');
    };

    // Public API - functions we want to call from HTML (e.g., in onclick attributes)
    return {
        init,
        openModal,
        closeModal,
        changePage
    };
})();