// Dark Mode Theme Switcher
// Handles theme toggling with localStorage persistence and prefers-color-scheme detection

class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.getElementById('theme-icon');
        this.THEME_KEY = 'preferred-theme';

        this.init();
    }

    init() {
        // Get initial theme
        const savedTheme = this.getSavedTheme();
        const preferredTheme = savedTheme || this.getSystemPreference();

        // Apply initial theme
        this.setTheme(preferredTheme, false);

        // Listen for theme toggle clicks
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system preference changes
        this.watchSystemPreference();
    }

    getSavedTheme() {
        try {
            return localStorage.getItem(this.THEME_KEY);
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }

    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    setTheme(theme, animate = true) {
        const root = document.documentElement;

        // Add transition class for smooth theme switching
        if (animate) {
            root.classList.add('theme-transitioning');
        }

        // Set theme attribute
        root.setAttribute('data-theme', theme);

        // Update icon
        this.updateIcon(theme);

        // Save to localStorage
        try {
            localStorage.setItem(this.THEME_KEY, theme);
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }

        // Remove transition class after animation
        if (animate) {
            setTimeout(() => {
                root.classList.remove('theme-transitioning');
            }, 300);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
    }

    updateIcon(theme) {
        if (!this.themeIcon) return;

        if (theme === 'dark') {
            this.themeIcon.classList.remove('fa-moon');
            this.themeIcon.classList.add('fa-sun');
            this.themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.themeIcon.classList.remove('fa-sun');
            this.themeIcon.classList.add('fa-moon');
            this.themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    watchSystemPreference() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Modern browsers
        if (darkModeQuery.addEventListener) {
            darkModeQuery.addEventListener('change', (e) => {
                // Only apply system preference if user hasn't set a preference
                if (!this.getSavedTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light', true);
                }
            });
        }
        // Legacy browsers
        else if (darkModeQuery.addListener) {
            darkModeQuery.addListener((e) => {
                if (!this.getSavedTheme()) {
                    this.setTheme(e.matches ? 'dark' : 'light', true);
                }
            });
        }
    }
}

// Initialize theme manager when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ThemeManager();
    });
} else {
    new ThemeManager();
}

// Prevent flash of unstyled content (FOUC)
// This script should be loaded in the <head> with defer attribute
(function() {
    const savedTheme = localStorage.getItem('preferred-theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemPreference;

    document.documentElement.setAttribute('data-theme', theme);
})();
