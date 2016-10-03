var test = require('tape'),
    bengt = require('../lib/bengt'),
    fs = require('fs'),
    path = require('path'),
    csv = fs.readFileSync(path.join(__dirname, 'test.csv'), 'utf8'),
    userData = {
      file: csv,
      groupBy: "namn",
      skip: "ålder,roll,datum",
      uniq: "",
      filters: "diagnos, max(datum)",
      exportToFile: false,
      exportAsCSV: false
    };

test('diagnos max(datum) groupBy namn', function(t){
  bengt.main(userData, function(data){
    t.equal(data[0].diagnos, 'social fobi', 'erik senaste diagnos');
    t.equal(data[1].diagnos, 'bipolär', 'örjans senaste diagnos');
    t.end();
  });
});

test('diagnos max(datum) no groupBy', function(t){
  userData.groupBy = "";
  bengt.main(userData, function(data){
    t.equal(data.diagnos, 'social fobi', 'senaste diagnosen');
    t.end();
  });
});