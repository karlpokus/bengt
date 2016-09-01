var fs = require('fs');

module.exports = function(req, res){
  fs.readFile(__dirname + '/index.html', function(err, data){
    if (err) throw err;
    
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}