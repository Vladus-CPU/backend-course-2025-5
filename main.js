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
const server = http.createServer(function (request, response){
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
});

server.listen(options.port, options.host, function () {
    console.log(`Server running at http://${options.host}:${options.port}/`);
});