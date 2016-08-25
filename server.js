var http = require('http'),
    server = http.createServer(),
    port = process.env.PORT || 8080;

server.on('request', function(req, res){
  res.end('Hi!');
})

server.listen(port, function(){
  console.log('Server running..');
});
