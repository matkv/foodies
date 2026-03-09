(function () {
    /* ── Dark mode toggle ── */
    const STORAGE_KEY = 'foodies-theme';
    const toggle = document.getElementById('theme-toggle');

    function applyTheme(dark) {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        if (toggle) {
            const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
            toggle.setAttribute('aria-label', label);
            toggle.setAttribute('title', label);
        }
    }

    function getSavedTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function saveTheme(dark) {
        try {
            localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
        } catch (e) {
            /* storage unavailable – silently ignore */
        }
    }

    /* Initialise: saved preference → OS preference → light */
    const saved = getSavedTheme();
    const prefersDark = saved
        ? saved === 'dark'
        : window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark);

    if (toggle) {
        toggle.addEventListener('click', function () {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            applyTheme(!isDark);
            saveTheme(!isDark);
        });
    }

    /* ── Frame loader ── */
    const container = document.getElementById('frame-container');
    if (!container) { return; }

    function renderFrames(urls) {
        urls.forEach((url) => {
            const iframe = document.createElement('iframe');
            iframe.title = 'Menu';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.src = url;
            container.appendChild(iframe);
        });
    }

    function showError(message) {
        const p = document.createElement('p');
        p.style.color = 'crimson';
        p.textContent = message;
        container.appendChild(p);
    }

    fetch('sites.json', { cache: 'no-cache' })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to load sites.json: ' + res.status + ' ' + res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            const urls = Array.isArray(data) ? data : (Array.isArray(data.sites) ? data.sites : []);
            if (urls.length === 0) {
                showError('No sites configured. Edit sites.json to add URLs.');
                return;
            }
            renderFrames(urls);
        })
        .catch((err) => {
            showError(err.message || 'Error loading menus');
        });
})();
