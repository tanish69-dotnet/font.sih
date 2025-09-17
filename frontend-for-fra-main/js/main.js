// Minimal App object to enable authentication flow
window.App = {
    init: function(user) {
        // Show a welcome message or initialize dashboard
        console.log('App initialized for user:', user);
        // Optionally, update UI with user info
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.insertAdjacentHTML('afterbegin', `<div class="welcome-message">Welcome, ${user.fullName || 'User'}!</div>`);
        }
    }
};
// === main.js ===

// This is now the ONLY job of the initial page load: start the authentication process.
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});

// The App module contains all the logic for the main application,
// but it will only be initialized by the Auth module AFTER a successful login.
const App = (() => {
    const state = {
        currentUser: null,
        currentPage: 'dashboard-view'
    };
    
    const loadComponent = async (component, containerId) => {
        try {
            const response = await fetch(`components/${component}.html`);
            if (!response.ok) throw new Error(`Failed to load ${component}.html`);
            const html = await response.text();
            document.getElementById(containerId).innerHTML = html;
        } catch (error) {
            console.error(error);
        }
    };

    const showPage = (pageId) => {
        document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
        const newPage = document.getElementById(pageId);
        if (newPage) {
            newPage.classList.add('active');
            state.currentPage = pageId;
            console.log(`Mapsd to ${pageId}`);
            if (pageId === 'map-view') {
                FraMap.createMap();
            }
        }
    };

    const setupEventListeners = () => {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('mobile-menu-backdrop');

        document.body.addEventListener('click', (event) => {
            const navLink = event.target.closest('.nav-link');
            if (navLink) {
                event.preventDefault();
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
                
                const page = navLink.dataset.page;
                showPage(`${page}-view`);
                
                if (sidebar.classList.contains('show')) {
                    sidebar.classList.remove('show');
                    backdrop.classList.remove('show');
                }
            }
            const menuToggle = event.target.closest('.menu-toggle');
            if (menuToggle) {
                sidebar.classList.toggle('show');
                backdrop.classList.toggle('show');
            }
            if (event.target === backdrop) {
                sidebar.classList.remove('show');
                backdrop.classList.remove('show');
            }
        });
    };
    
    const configureUIForRole = (user) => {
        const userNameEl = document.querySelector('.user-avatar-button span');
        if (userNameEl) {
            userNameEl.innerHTML = `${user.fullName} <i class="fas fa-caret-down"></i>`;
        }

        if (user.role !== 'admin') {
            document.querySelectorAll('[data-page="dss"], [data-page="settings"], [data-page="reports"]').forEach(el => {
                const parentLi = el.closest('li');
                if (parentLi) parentLi.style.display = 'none';
            });
        }
    };

    const init = async (user) => {
        console.log("Initializing App Module for user:", user.fullName);
        state.currentUser = user;

        // Initialize all feature modules
        Dashboard.init();
        FraMap.init();
        Documents.init();
        DSS.init();
        Reports.init();
        Claims.init();
        Settings.init();

        // Load HTML components
        await Promise.all([
            loadComponent('header', 'header-container'),
            loadComponent('sidebar', 'sidebar-container'),
            loadComponent('footer', 'footer-container')
        ]);
        
        // Setup the UI and initial view
        setupEventListeners();
        configureUIForRole(user);
        showPage(state.currentPage);

        // Register the Service Worker for PWA functionality
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
        }
    };

    return {
        init,
        state
    };
})();