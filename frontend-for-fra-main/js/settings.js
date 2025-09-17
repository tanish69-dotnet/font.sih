// === settings.js ===
// Handles the settings page functionality: Theme switching and Profile form.

const Settings = (() => {

    /**
     * The main initialization function for the module.
     * Finds elements on the page and attaches event listeners.
     */
    const init = () => {
        console.log("Initializing Settings Module...");
        
        const userProfileForm = document.getElementById('user-profile-form');
        const themeToggle = document.getElementById('theme-toggle-checkbox');

        // Attach event listener for the profile form submission
        if (userProfileForm) {
            userProfileForm.addEventListener('submit', handleProfileUpdate);
        }
        
        // Setup the theme toggle switch
        if (themeToggle) {
            // When the page loads, check localStorage and set the toggle to the correct position
            themeToggle.checked = localStorage.getItem('theme') === 'dark';
            
            // Add a listener for when the user clicks the toggle
            themeToggle.addEventListener('change', handleThemeToggle);
        }
    };

    /**
     * Handles the theme switch toggle.
     * Adds/removes the 'dark-mode' class and saves the user's preference.
     */
    const handleThemeToggle = (event) => {
        if (event.target.checked) {
            // If the toggle is checked, add the 'dark-mode' class to the body
            document.body.classList.add('dark-mode');
            // Save the user's preference to localStorage
            localStorage.setItem('theme', 'dark');
        } else {
            // If unchecked, remove the 'dark-mode' class
            document.body.classList.remove('dark-mode');
            // Save the user's preference to localStorage
            localStorage.setItem('theme', 'light');
        }
    };

    /**
     * A simple function to demonstrate sanitizing user input as a basic security measure.
     * It prevents HTML from being interpreted by the browser.
     */
    const sanitizeInput = (str) => {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    };

    /**
     * Handles the submission of the user profile form.
     */
    const handleProfileUpdate = (event) => {
        event.preventDefault(); // Prevent the form from reloading the page
        
        const fullNameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email');

        // Sanitize inputs before using them
        const sanitizedName = sanitizeInput(fullNameInput.value);

        console.log("Simulating profile update...");
        console.log("Sanitized Full Name:", sanitizedName);
        console.log("Email:", emailInput.value);
        
        // Show a success notification using our utility function
        Utils.showToast('Profile updated successfully!', 'success');
    };

    // Expose the init function so it can be called from main.js
    return {
        init
    };
})();