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
    getPage(request.url, response);
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getPage(pathToPage = '/', response) {
    response.setHeader('Content-Type', 'text/html');
    // let pathToPage = '';
    if (pathToPage == '/') {
        pathToPage = 'index.html';
    } else {
        // A path with the .html
        pathToPage = pathToPage.slice(1);
    }

    // console.log(pathToPage);
    fs.readFile(pathToPage, 'utf-8', (err, page) => {
        if (!err) {
            fs.readFile('elements/menu.html', 'utf-8', (err, element) => {
                if (err) throw err;
                page = page.replace(/\{\{menu\}\}/g, element);
                response.statusCode = 200;
                response.end(page);
            });
        } else {
            fs.readFile('pages/404.html', (err, data) => {
                if (err) throw err;
                response.statusCode = 404;
                response.end(data);
            });
        }
    });
}
  



