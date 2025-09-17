// === auth.js ===
// Handles the simulated authentication process with user roles.

const Auth = (() => {
    // Hardcoded credentials for simulation. This acts as our user database.
    const USERS = [
        { username: 'admin', password: 'adminpass', role: 'admin', fullName: 'Admin User' },
        { username: 'user', password: 'userpass', role: 'user', fullName: 'District Officer' }
    ];

    // Get references to the main HTML containers and form elements
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.querySelector('.app-container');
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('login-error-message');

    /**
     * This is the entry point for the module, called when the page first loads.
     */
    const init = () => {
        console.log("Initializing Auth Module...");
        // Attach the login handler to the form's submit event
        loginForm?.addEventListener('submit', handleLogin);
        // Add a global listener for the logout button (which will be loaded later)
        document.body.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn') {
                handleLogout();
            }
        });
        // Check if the user is already logged in from the current session
        checkLoginStatus();
    };

    /**
     * Handles the login form submission.
     */
    const handleLogin = (e) => {
        e.preventDefault(); // Stop the page from reloading
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Find a user in our database that matches the entered credentials
        const foundUser = USERS.find(u => u.username === username && u.password === password);

        if (foundUser) {
            // If credentials are correct, save the user's state to the session
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userRole', foundUser.role);
            sessionStorage.setItem('userName', foundUser.fullName);
            // Show the main application
            showApp(foundUser);
        } else {
            // If credentials are wrong, show an error message
            errorMessage.textContent = 'Invalid username or password.';
        }
    };

    /**
     * Handles the logout process.
     */
    const handleLogout = () => {
        sessionStorage.clear(); // Clear all session data (isLoggedIn, userRole, etc.)
        location.reload(); // Reload the page to reset everything
    };

    /**
     * Checks the session storage when the page first loads to see if a user is already logged in.
     */
    const checkLoginStatus = () => {
        if (sessionStorage.getItem('isLoggedIn') === 'true') {
            // If logged in, reconstruct the user object from session data
            const user = {
                role: sessionStorage.getItem('userRole'),
                fullName: sessionStorage.getItem('userName')
            };
            showApp(user);
        } else {
            // If not logged in, show the login page
            showLogin();
        }
    };

    /**
     * Shows the main application and hides the login form.
     * It also initializes the main application logic.
     */
    const showApp = (user) => {
        loginContainer.style.display = 'none';
        appContainer.style.display = 'grid'; // Use 'grid' to match our main layout style
        
        // This is the critical step: initialize the main app and pass the user object to it
        App.init(user);
    };

    /**
     * Shows the login form and hides the main application.
     */
    const showLogin = () => {
        loginContainer.style.display = 'flex';
        appContainer.style.display = 'none';
    };

    // Expose the init function to be called from main.js
    return {
        init
    };
})();