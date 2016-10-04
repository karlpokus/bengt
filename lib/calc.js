var _ = require('underscore');

var calc = {
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
  concats: function(headers, data) {
    return _.chain(headers)
      .map(function(header){
        var o = {};
        o[header] = _.chain(data)
          .pluck(header)
          .filter(function(str){return str})
          .join(';')
          .value();
        return o;
      })
      .value()
      .reduce(function(base, o){ // [{}, {}..] -> {}
        _.extend(base, o);
        return base;
      }, {});
  },
  filters: function(headerObjs, data) {
    
    /*
    headerObj = [
      {
        target: col,
        max: col,
        filtersWithOperator: [
          {k, op, v}
        ]
      },
      {..}
    ]
    */
    
    function doComparison(k, op, v) {
      if (op === '!=') {return k != v;}
      if (op === '=') {return k == v;}
      if (op === '>=') {return k >= v;}
      if (op === '<=') {return k <= v;}
      if (op === '>') {return k > v;}
      if (op === '<') {return k < v;}
      if (op === '/') {return new RegExp(v).test(k);} 
    }
    
    return _.chain(headerObjs)
      .map(function(headerObj){
        var o = {},
            _data,
            dataWithValidDates;
        
        if (headerObj.filtersWithOperator) {
          _data = headerObj.filtersWithOperator.reduce(function(base, filterObj, i){
            if (i === 0) {
              base = data.filter(function(o){
                return (o[filterObj.k])?
                  doComparison(o[filterObj.k], filterObj.op, filterObj.v):
                  false;
              });
            } else {
              base = base.filter(function(o){
                return (o[filterObj.k])?
                  doComparison(o[filterObj.k], filterObj.op, filterObj.v):
                  false;                
              });
            }
            return base;
          }, []);
        }
        
        if (headerObj.max) {
          dataWithValidDates = (_data || data).filter(function(o){
            return calc.isValidDate(new Date(o[headerObj.max]));
          });
          
          if (dataWithValidDates.length > 0) {
            o[headerObj.target] = dataWithValidDates.sort(function(a, b){
              return new Date(b[headerObj.max]) - new Date(a[headerObj.max]);
            })[0][headerObj.target];
          }
          
        } else {
          // concat
          o[headerObj.target] = _.chain(_data)
            .pluck(headerObj.target)
            .filter(function(str){return str})
            .join(';')
            .value();
        }
        return o;      
      })
      .value()
      .reduce(function(base, o){ // [{}, {}..] -> {}
          _.extend(base, o);
          return base;
        }, {});
  },
  uniq: function(headers, data) {
    return _.chain(headers)
      .map(function(header){
        var o = {};      
        o[header] = _.chain(data)
          .pluck(header)
          .filter(function(str){return str})
          .uniq()
          .join(';')
          .value();
        return o;
      })
      .value()
      .reduce(function(base, o){ // [{}, {}..] -> {}
        _.extend(base, o);
        return base;
      }, {});
  },
  calcByHeadersAndData: function(headers, data) {
    return Object.keys(headers).map(function(action){
      return calc[action](headers[action], data);
    }).reduce(function(base, o){
      _.extend(base, o);
      return base;
    }, {});
  }
};

module.exports = calc;