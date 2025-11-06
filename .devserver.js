// Tiny static server for local testing only.
// Usage: node .devserver.js
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), decodeURIComponent(req.url.split('?')[0] || '/'));
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
    }
    if (req.url === '/' || req.url === '') {
        filePath = path.join(process.cwd(), 'index.html');
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath);
        const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json' };
        res.setHeader('Content-Type', types[ext] || 'text/plain');
        res.end(content);
    });
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Static dev server at http://localhost:${port}`));
