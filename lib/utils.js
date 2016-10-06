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
      exportType: userData.exportType,
      debug: userData.debug
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
          o.v = parts[1].trim();
          o.op = op;
        }
        return o;
      }).filter(function(o){ // discard empty o
        return Object.keys(o).length > 0;
      });
      return (filtersArray.length > 0)? filtersArray: null;
    }

    /*
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
    */

    function parseFunctionFilter(target, arr) {
      var match,
          matches = [],
          re = new RegExp(target + '\\((.+)\\)');
      arr.forEach(function(str){
        match = str.match(re);
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
        o.max = parseFunctionFilter('max', filters);
        o.rename = parseFunctionFilter('rename', filters);
        o.filtersWithOperator = parseFiltersWithOperator(filters);
        out.push(o);
      }
    });
    return out;
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
  validateInputs: function(data, fields) {
    var userInputs = data.skip.concat(data.uniq);
    if (data.filters.length > 0) {
      data.filters.forEach(function(o){
        userInputs.push(o.target);
      });
    }
    if (data.groupBy) {
      userInputs.push(data.groupBy);
    }
    if (userInputs.length > 0) {
      var invalid = userInputs.filter(function(header){
        return fields.indexOf(header) === -1;
      });
      if (invalid.length > 0) {
        return invalid;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};

module.exports = utils;
