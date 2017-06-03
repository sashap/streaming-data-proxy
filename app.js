// Service for connecting to and streaming data from applications running on Hadoop YARN with socket.io

var fs = require('fs');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');
var dateFormat = require('dateformat');
var marked = require('marked');


var LISTEN_PORT = parseInt(process.env.LISTEN_PORT || '9080');


// Add date to logs
console.logCopy = console.log.bind(console);
console.log = function(){
  var args = [dateFormat(new Date(), "[yyyy/mm/dd HH:MM:ss]")];
  for(var i = 0; i < arguments.length; ++i) { 
    args.push(arguments[i]);
  }  
  console.logCopy.apply(console, args);
};


marked.setOptions({
  gfm: true,
  tables: true,
  langPrefix: ''
});

// Loads specified Markdown file and returns contents as an HTML string
var mdToHTML = function(mdFile) {
  var md;
  if (fs.existsSync(mdFile)) {
    md = '<html><head><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/2.6.0/github-markdown.css"><style>body {box-sizing: border-box;min-width: 200px;max-width: 980px;margin: 0 auto;padding: 45px;}</style></head><body><span class="markdown-body">';
    md += marked(fs.readFileSync(mdFile, "utf-8"));
    md += '</span></body></html>';
  }
  return md;
};

var readme = mdToHTML(__dirname + '/README.md') || '<h1>DataTorrent AppData Socket.IO Proxy</h1>';




// Express server configuration
server.listen(LISTEN_PORT);
console.log("Listening on " + LISTEN_PORT);

app.get('/', function (req, res) {
  res.send(readme);
});
app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/admin.html');
});
