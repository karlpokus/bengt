var Papa = require('babyparse');

var utils = {
  parseFile: function(file, cb) {
    Papa.parse(file, {
      skipEmptyLines: true,
      dynamicTyping: true,
      header: true,
      complete: cb
    });
  },
  parseInput: function(userData) {
    return {
      file: userData.file,
      groupBy: userData.groupBy.trim(),
      skip: utils.parseInputToArray(userData.skip),
      uniq: utils.parseInputToArray(userData.uniq),
      filters: utils.parseFilters(userData.filters),
      exportToFile: userData.exportToFile,
      exportAsCSV: userData.exportAsCSV
    };
  },
  parseInputToArray: function(str) {
    return str.split(',').map(function(str){ 
      return str.trim();
    }).filter(function(str){
      return str;
    });
  },
  parseFilters: function(userString) {
    function toNum(v, op) {
      if (/<|>/.test(op)) {
        return Number(v);
      } else {
        return v;
      }
    }
  
    function parseFiltersWithOperator(arr) {
      var filtersArray = arr.map(function(str){
        var o = {},
            match = str.match(/!=|=|>=|<=|>|<|\//),
            parts,
            op;
        if (match) {
          op = match[0];
          parts = str.split(op);
          o.k = parts[0].trim();
          o.v = parts[1].trim(); // toNum()
          o.op = op; 
        }
        return o;
      }).filter(function(o){ // discard empty o
        return Object.keys(o).length > 0;
      });
      return (filtersArray.length > 0)? filtersArray: null;
    }
  
    function parseMaxFilter(arr) {
      var match,
          matches = [];
      arr.forEach(function(str){
        match = str.match(/max\((\w+)\)/);
        if (match) {
          matches.push(match[1]);
        }
      });
      return (matches.length > 0)? matches[0]: null;
    }
  
    var out = [], o, filters,
        parts = userString.split(';');
  
    parts.forEach(function(part){
      o = {};
      part = part.split(',').map(function(str){
        return str.trim();
      });

      if (part.length > 1) {
        o.target = part[0];
        filters = part.slice(1);
        o.max = parseMaxFilter(filters);
        o.filtersWithOperator = parseFiltersWithOperator(filters);
        out.push(o);
      }
    });
    return out;
  },
  isValidDate: function(d) {
    if (Object.prototype.toString.call(d) === "[object Date]") {
      if (isNaN(d.getTime())) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  },
  getHeaders: function(userData, headers) {
    var groupBy = userData.groupBy,
        skip = userData.skip,
        uniq = userData.uniq,
        filters = userData.filters;
    
    var filterHeaders = [];
    // remove by skip and groupBy
    headers = headers.filter(function(header){
      return skip.indexOf(header) === -1 && header !== groupBy;
    });
    var o = {};
    // get filter header by o.target
    if (filters.length > 0) {
      filterHeaders = filters.map(function(o){
        return o.target;
      });
      o.filters = filters;
    }
    // uniq is ready
    if (uniq.length > 0) {
      o.uniq = uniq;
    }
    // concat all the rest
    o.concats = headers.filter(function(header){
      return uniq.indexOf(header) === -1 && filterHeaders.indexOf(header) === -1;
    });
    if (o.concats.length === 0) {
      delete o.concats;
    }
    return o;
  },
  exportData: function(out, userData) {
    if (userData.exportAsCSV) {
      out = Papa.unparse(out);
    }
    if (userData.exportToFile) {
      var d = new Date(),
          ts = d.toJSON(),
          fileName = 'bengt-export_' + ts + '.csv',
          blob = new Blob([out], {type: "text/plain;charset=utf-8"});
      saveAs(blob, fileName);
    } else {
      console.log(out);
    }    
  }
};

module.exports = utils;