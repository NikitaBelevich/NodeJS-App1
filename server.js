'use strict';

const fs = require('fs');
const util = require('util');
const EventEmitter = require('events');
const http = require('http');
const url = require('url');

const hostname = '127.0.0.5';
const port = 3005;

const server = http.createServer((request, response) => {
    
    if (request.url == '/favicon.ico') return; //!!!

    console.log(request.url);
    
    response.setHeader('Content-Type', 'text/html');
    if (request.url == '/') {
        response.statusCode = 200;
        fs.readFile(`index.html`, (err, data) => {
            if (err) throw err;
            response.end(data);
        });
    } else {
        // console.log(`${request.url.slice(1)}`);
        fs.readFile(`${request.url.slice(1)}`, (err, data) => {
            if (!err) {
                response.statusCode = 200;
                response.end(data);
            } else {
                fs.readFile('pages/404.html', (err, data) => {
                    if (err) throw err;
                    response.statusCode = 404;
                    response.end(data);
                });
            }
        });
    };
    
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
});


  




