var test = require('tape'),
    bengt = require('../lib/bengt'),
    fs = require('fs'),
    path = require('path'),
    csv = fs.readFileSync(path.join(__dirname, 'test.csv'), 'utf8'),
    userData = {
      file: csv,
      groupBy: '',
      skip: '',
      uniq: '',
      filters: '',
      exportType: null
    };

test('diagnos max(datum) && groupBy=namn', function(t){
  userData.filters = "diagnos, max(datum)";
  userData.groupBy = "namn";
  
  bengt.main(userData, function(err, data){
    t.false(err);
    t.equal(data[0].diagnos, 'paniksyndrom');
    t.equal(data[1].diagnos, 'bipolär');
    t.end();
  });
});

test('diagnos, max(datum), roll=läk && groupBy=namn', function(t){
  userData.filters = "diagnos, max(datum), roll=läk";
  userData.groupBy = "namn";
  
  bengt.main(userData, function(err, data){
    t.false(err);
    t.equal(data[0].diagnos, 'ocd');
    t.equal(data[1].diagnos, 'adhd');
    t.end();
  });
});

test('diagnos, ålder>30 && groupBy=none', function(t){
  userData.filters = "diagnos, ålder>30";
  userData.groupBy = "";
  
  bengt.main(userData, function(err, data){
    t.false(err);
    t.equal(data.diagnos, 'psykos');
    t.end();
  })
});

test('diagnos, diagnos/i/ && groupBy=none', function(t){
  userData.filters = "diagnos, diagnos/i/";
  userData.groupBy = "";
  
  bengt.main(userData, function(err, data){
    t.false(err);
    t.equal(data.diagnos, 'social fobi;paniksyndrom;mani;bipolär');
    t.end();
  });
});

test('diagnos, max(datum) && groupBy=none', function(t){
  userData.filters = "diagnos, max(datum)";
  userData.groupBy = "";
  
  bengt.main(userData, function(err, data){
    t.false(err);
    t.equal(data.diagnos, 'paniksyndrom');
    t.end();
  });
});

test('invalid inputs', function(t){
  userData.groupBy = 'err1';
  userData.skip = 'ålder, err2';
  userData.uniq = 'err3';
  userData.filters = 'err4, err5=70';

  bengt.main(userData, function(err, data){
    t.false(data);
    t.equal(err, 'err2,err3,err4,err1');
    t.end();
  });
});