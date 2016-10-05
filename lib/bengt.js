var utils = require('./utils'),
    calc = require('./calc'),
    _ = require('underscore');

var bengt = {
  main: function(userData, cb) {
    this.userData = utils.parseInput(userData);
    utils.parseFile(bengt.userData.file, function(result){
      
      var invalid = utils.validateInputs(bengt.userData, result.meta.fields);
      if (invalid) {
        return cb(invalid.join());
      } 
      
      var data = result.data,
          headers = utils.getHeaders(bengt.userData, result.meta.fields),
          groupBy = bengt.userData.groupBy,
          out;
      
      if (groupBy) {
        out = bengt.computeByGroup(groupBy, data, headers);
      } else {
        out = bengt.computeAll(data, headers);
      }
      
      cb(null, out);
    });
  },
  computeByGroup: function(groupBy, data, headers) {
    var groupByData,
        groupByObj,
        groupByValues = _.chain(data) // mike, stan, erin..
          .pluck(groupBy)
          .uniq()
          .value();
    
    return groupByValues.map(function(val){ // mike
      groupByData = data.filter(function(o){ // all mikes data
        return o[groupBy] === val;
      });
      
      groupByObj = calc.calcByHeadersAndData(headers, groupByData);
      groupByObj[groupBy] = val; // key: mike
      return groupByObj; // return mikes obj
    });
  },
  computeAll: function(data, headers) {
    return calc.calcByHeadersAndData(headers, data);
  }
};

module.exports = bengt;