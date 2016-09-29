var index = require('./lib/index'),
    http = require('http'),
    download = function(req, res){
      var str = '';
      req.on('data', function(chunk){
        str += chunk;
      }).on('end', function(){
        if (str !== '') {
          
          var o = {},
              arr = str.split('&').forEach(function(part){
                var parts = part.split('='),
                    k = parts[0],
                    v = parts[1];
                o[k] = v;
              });
                    
          if (o.filetype === 'excel') {
            res.setHeader('Content-disposition', 'attachment; filename=bengt.xls');
          }
          if (o.filetype === 'csv') {
            res.setHeader('Content-disposition', 'attachment; filename=bengt.csv');
          }
          
          res.setHeader('Content-type', 'text/plain');
          res.end(str);
        }
      });      
    },
    server = http.createServer(),
    port = process.env.PORT || 8080;

server.on('request', function(req, res){
  if (req.method === 'GET' && req.url === '/') {
    index(req, res);
  }
  if (req.method === 'POST' && req.url === '/calc') {
    download(req, res);
  }
})

server.listen(port, function(){
  console.log('Server running..');
});
