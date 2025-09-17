// === documents.js ===
// Handles the document management page simulation.

const Documents = (() => {
    // DOM element references
    let uploadZone, fileInput, uploadButton, processingStatus, viewerPlaceholder, viewerContent;

    const init = () => {
        console.log("Initializing Documents Module...");
        // Assign elements after the page is set up
        uploadZone = document.getElementById('upload-zone');
        fileInput = document.getElementById('file-input');
        uploadButton = document.getElementById('upload-button');
        processingStatus = document.getElementById('processing-status');
        viewerPlaceholder = document.getElementById('viewer-placeholder');
        viewerContent = document.getElementById('viewer-content');
        
        setupEventListeners();
    };

    const setupEventListeners = () => {
        if (!uploadZone) return; // Don't run if we are not on the documents page initially

        // Event listeners for drag and drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileUpload(files[0]);
            }
        });

        // Event listener for file browse button
        uploadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                handleFileUpload(fileInput.files[0]);
            }
        });
    };

    const handleFileUpload = (file) => {
        console.log("File selected:", file.name);
        // Reset previous results
        processingStatus.innerHTML = '';
        viewerContent.style.display = 'none';
        viewerPlaceholder.style.display = 'block';
        
        // Display file name and start simulation
        const statusHTML = `
            <p><strong>File:</strong> ${file.name}</p>
            <p id="status-text">Uploading...</p>
            <div class="progress-bar-container">
                <div id="progress-bar" class="progress-bar"></div>
            </div>`;
        processingStatus.innerHTML = statusHTML;

        simulateProcessing();
    };

    const simulateProcessing = () => {
        const progressBar = document.getElementById('progress-bar');
        const statusText = document.getElementById('status-text');
        
        // 1. Simulate Upload
        progressBar.style.width = '33%';
        setTimeout(() => {
            // 2. Simulate OCR Processing
            statusText.textContent = 'Processing (OCR)...';
            progressBar.style.width = '66%';
            setTimeout(() => {
                // 3. Simulate NER Extraction
                statusText.textContent = 'Extracting Entities (NER)...';
                progressBar.style.width = '100%';
                setTimeout(() => {
                    statusText.textContent = 'Processing Complete!';
                    displayResults();
                }, 1000);
            }, 1500);
        }, 1000);
    };

    const displayResults = () => {
        viewerPlaceholder.style.display = 'none';
        
        // This is where you would display real data. We'll use mock data.
        const resultsHTML = `
            <img src="https://placehold.co/800x1100.png?text=Document+Preview" alt="Document Preview" class="preview-image">
            
            <h4>Extracted Metadata</h4>
            <div class="metadata-grid">
                <p><strong>Applicant Name:</strong> Rani Majhi</p>
                <p><strong>Document Type:</strong> Land Record (Form A)</p>
                <p><strong>State:</strong> Odisha</p>
                <p><strong>District:</strong> Kalahandi</p>
                <p><strong>Claim ID Match:</strong> IFR-OD-KLH-002</p>
                <p><strong>Confidence Score:</strong> 92.5%</p>
            </div>

            <h4>Recognized Text (OCR/NER)</h4>
            <div class="ner-text-box">
                This land record dated <span class="ner-tag date">Nov 15, 1998</span>, confirms the occupation of plot 42B by applicant 
                <span class="ner-tag person">Rani Majhi</span>, daughter of <span class="ner-tag person">Arjun Majhi</span>. 
                The land is located in the village of <span class="ner-tag location">Basantapada</span>, within the 
                <span class="ner-tag location">Lanjigarh</span> taluka of <span class="ner-tag location">Kalahandi</span> district. 
                Witnesses include <span class="ner-tag person">Soma Pradhan</span>.
            </div>
        `;
        viewerContent.innerHTML = resultsHTML;
        viewerContent.style.display = 'block';
    };

    return {
        init
    };
})();