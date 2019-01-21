/*
 * Assignment #01
 * Please create a simple "Hello World" API. Meaning:
 * 1. It should be a RESTful JSON API that listens on a port of your choice. 
 * 2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want. 
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// define handlers
var handlers = {};

// sample handler
handlers.hello = function(data, callback) {
  // callback an HTTP status code and a payload object
  callback(200, data);
};

// not found handler
handlers.notFound = function(data, callback) {
  callback(404, { message: 'NOT FOUND' });
};

// define request router
var router = {
  hello: handlers.hello
};

var httpServer = http.createServer(function(req, res) {
  // get url and parse it
  var parsedUrl = url.parse(req.url, true);
  
  // get path from url
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');
  
  // get the query string as an object
  var queryString = parsedUrl.query;
  
  // get the http method
  var method = req.method.toLowerCase();
  
  // get the headers as an object
  var headers = req.headers;
  
  // get the payload, if there is any
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function(data) {
    buffer += decoder.write(data);
  });
  req.on('end', function() {
    buffer += decoder.end();
    
    // choose the handler this request should go to
    // if not foundm use notFound handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    
    // construct the data object to send to the handler
    var data = { message: 'WELCOME!' };
    
    // route the request to the handler specified in the handler
    chosenHandler(data, function(statusCode, payload) {
      // use the status code called back by the handler or default to 200
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
      
      // use the payload called the handler or default to empty object
      payload = typeof(payload) === 'object' ? payload : {};
      
      // convert payload to string
      var payloadString = JSON.stringify(payload);
      
      // return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
    });
  });
});

// Start the http server
httpServer.listen(3000, '0.0.0.0', function(){
  console.log('This is assignment #01. Go to <site>/hello...');
});
