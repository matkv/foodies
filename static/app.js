(function () {
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
