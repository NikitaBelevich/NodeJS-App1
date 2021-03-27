'use strict';

const fs = require('fs');
const util = require('util');
const EventEmitter = require('events');
const http = require('http');
const url = require('url');

const hostname = '127.0.0.5';
const port = 3005;

const regexpForImages = /\.jpg$|\.jpeg$|\.png$|\.svg$|\.webp$|\.gif$/;

const server = http.createServer((request, response) => {
    if (request.url == '/favicon.ico') {
        sendFavicon(request.url, response);
    }
    if (request.url.endsWith('.css')) {
        sendCSS(request.url, response);
    } else if (request.url.endsWith('.js')) {
        sendJS(request.url, response);
    } else if (request.url.match(regexpForImages)) {
        // If the URL has an image extension of the regexpForImage, then it's a request on an image
        let extensionOfImg = request.url.match(regexpForImages)[0].slice(1);
        extensionOfImg = (extensionOfImg == 'svg') ? 'svg+xml' : extensionOfImg;
        sendImage(request.url, extensionOfImg, response);
    } else {
        sendPage(request.url, response);
    }
    
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function sendPage(pathToPage = '/', response) {
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
function sendCSS(pathToCSS, response) {
    fs.readFile(pathToCSS.slice(1), (err, cssFile) => {
        if (err) throw err;
        response.setHeader('Content-Type', 'text/css');
        response.statusCode = 200;
        response.end(cssFile);
    });
}
function sendFavicon(pathToFavicon, response) {
    fs.readFile(pathToFavicon.slice(1), (err, favicon) => {
        if (err) console.error('favicon.ico not found');
        response.setHeader('Content-Type', 'image/x-icon');
        response.statusCode = 200;
        response.end(favicon);
    });
}
function sendJS(pathToJS, response) {
    fs.readFile(pathToJS.slice(1), (err, jsFile) => {
        if (err) throw err;
        response.setHeader('Content-Type', 'application/javascript');
        response.statusCode = 200;
        response.end(jsFile);
    });
}
function sendImage(pathToIMG, extension, response) {
    fs.readFile(pathToIMG.slice(1), (err, imgFile) => {
        if (err) throw err;
        response.setHeader('Content-Type', `image/${extension}`);
        response.statusCode = 200;
        response.end(imgFile);
    });
}

