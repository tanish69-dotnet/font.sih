// === reports.js ===
// Handles the Reports & Analytics page functionality.

const Reports = (() => {
    let allClaimsData = [];
    let reportChart = null;
    const { jsPDF } = window.jspdf; // Import jsPDF from the global window object

    const init = async () => {
        console.log("Initializing Reports Module...");
        allClaimsData = (await DataService.getFraData())?.claims || [];
        
        const reportForm = document.getElementById('report-generator-form');
        if (reportForm) {
            reportForm.addEventListener('submit', generateReport);
        }

        document.getElementById('print-report-btn')?.addEventListener('click', () => window.print());
        document.getElementById('pdf-export-btn')?.addEventListener('click', handleExportPDF);
        document.getElementById('csv-export-btn')?.addEventListener('click', handleExportCSV);
    };

    const generateReport = (event) => {
        event.preventDefault();
        const state = document.getElementById('report-state').value;
        const status = document.getElementById('report-status').value;
        
        // Filter the data based on form inputs
        const filteredData = allClaimsData.filter(claim => {
            const stateMatch = (state === 'all') || (claim.state === state);
            const statusMatch = (status === 'all') || (claim.status === status);
            return stateMatch && statusMatch;
        });

        renderReport(filteredData, { state, status });
    };

    const renderReport = (data, params) => {
        document.querySelector('.report-display-area .placeholder-text').style.display = 'none';
        document.getElementById('report-output').style.display = 'block';
        
        const reportContent = document.getElementById('report-content');
        const reportDate = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });

        // Build HTML for the report
        let tableHTML = `
            <h2>Claims Summary Report</h2>
            <p>Generated on: ${reportDate} | Filters: State (${params.state}), Status (${params.status})</p>
            <table>
                <thead>
                    <tr>
                        <th>Claim ID</th>
                        <th>Applicant</th>
                        <th>State</th>
                        <th>District</th>
                        <th>Status</th>
                        <th>Area (ha)</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(claim => `
                        <tr>
                            <td>${claim.claimId}</td>
                            <td>${claim.applicantName}</td>
                            <td>${claim.state}</td>
                            <td>${claim.district}</td>
                            <td>${claim.status}</td>
                            <td>${claim.areaClaimedHectares.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <canvas id="reportChart" style="margin-top: 2rem;"></canvas>
        `;
        reportContent.innerHTML = tableHTML;

        // Create a simple chart for the report
        const ctx = document.getElementById('reportChart').getContext('2d');
        const statusCounts = data.reduce((acc, claim) => {
            acc[claim.status] = (acc[claim.status] || 0) + 1;
            return acc;
        }, {});
        
        if (reportChart) reportChart.destroy(); // Clear previous chart instance
        reportChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: ['rgba(25, 135, 84, 0.7)', 'rgba(255, 193, 7, 0.7)', 'rgba(220, 53, 69, 0.7)']
                }]
            }
        });
    };
    
    const handleExportPDF = () => {
        const doc = new jsPDF();
        const reportContent = document.getElementById('report-content');
        const title = reportContent.querySelector('h2').innerText;
        const subtitle = reportContent.querySelector('p').innerText;
        
        doc.text(title, 14, 15);
        doc.setFontSize(10);
        doc.text(subtitle, 14, 22);

        // Use autoTable plugin to convert HTML table to PDF
        doc.autoTable({
            html: '#report-content table',
            startY: 30,
        });
        
        doc.save('fra_report.pdf');
    };
    
    const handleExportCSV = () => {
        const table = document.querySelector('#report-content table');
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, 'fra_report.xlsx');
    };

    return {
        init
    };
})();