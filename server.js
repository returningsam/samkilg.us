function server_log(str) {
  console.log("[" + (new Date()).toString().split(" ").splice(1,4) + "] " + str);
}

var fs = require('fs');

var http = require('http');

var url = require('url');

var port = process.env.PORT || 3000;

function start_server() {
  // Configure our HTTP server to respond to requests.
  var server = http.createServer(function (request, response) {
    var path = url.parse(request.url).pathname;
    server_log("Request recieved: " + path);
    if (path=="/get_css") {
      fs.readFile('./assets/style.css', function(err, file) {
        if(err) {
          server_log("css file not found...");
          return;
        }
        response.writeHead(200, {
          "Content-Type": "text/css",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Origin": "*"
        });
        response.end(file, "utf-8");
      });
    }
    else if (path=="/get_js") {
      fs.readFile('./assets/main.js', function(err, file) {
        if(err) {
          server_log("js file not found...");
          return;
        }
        response.writeHead(200, {
          "Content-Type": "application/javascript",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Origin": "*"
         });
        response.end(file, "utf-8");
      });
    }
    else if (path=="/get_logo") {
      fs.readFile('./assets/S.svg', function(err, file) {
        if(err) {
          server_log("logo file not found...");
          return;
        }
        response.writeHead(200, {
          "Content-Type": "image/svg+xml",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Origin": "*"
         });
        response.end(file, "utf-8");
      });
    }
    else if (path=="/get_resume") {
      fs.readFile('./assets/resume.pdf', function(err, file) {
        if(err) {
          server_log("resume file not found...");
          return;
        }
        response.writeHead(200, {
          "Content-Type": "application/pdf",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Origin": "*"
         });
        response.end(file, "utf-8");
      });
    }
    else{
      fs.readFile('./assets/index.html', function(err, file) {
        if(err) {
          // write an error response or nothing here
          return;
        }

        response.writeHead(200, {
          "Content-Type": "text/html",
          "Access-Control-Allow-Headers": "X-Requested-With",
          "Access-Control-Allow-Origin": "*"
         });
        response.end(file, "utf-8");
      });
    }
  });

  server.listen(port);
  server_log('Server started at port: ' + port);
}

/*******************************************************************************
********************************* Startup **************************************
*******************************************************************************/

start_server();
