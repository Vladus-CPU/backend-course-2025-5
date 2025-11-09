const fs = require('fs');
const http = require('http');
const commander = require('commander');

const program = commander.program;

program
    .requiredOption('-h, --host <host>', 'server address')
    .requiredOption('-p, --port <port>', 'server port')
    .requiredOption('-c, --cache <cache>', 'path to cache directory');

program.parse();
const options = program.opts();
if (!fs.existsSync(options.cache)) {
    fs.mkdirSync(options.cache, { 
        recursive: true 
    });
}
const server = http.createServer(async function (request, response){
    const url = request.url;
    const statuscode = url.replace('/', '');
    if (statuscode.length !== 3  || isNaN(statuscode)) {
        response.writeHead(404, { 'Content-Type': 'text/plain' });
        return response.end('Not Found');
    }
    const cachefilepath = options.cache + '/' + statuscode + '.jpeg';
    const method = request.method;
    const promise = fs.promises;
    if (method === 'GET') {
        try {
            const data = await promise.readFile(cachefilepath);
            response.writeHead(200, { 'Content-Type': 'image/jpeg' });
            return response.end(data);
        } catch {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            return response.end('Not Found');
        }
    }
});

server.listen(options.port, options.host, function () {
    console.log(`Server running at http://${options.host}:${options.port}/`);
});