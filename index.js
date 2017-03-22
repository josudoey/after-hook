module.exports = function (func, hook) {
  if (typeof func !== 'function') {
    throw new TypeError('"func" argument must be a function');
  }
  if (typeof hook !== 'function') {
    throw new TypeError('"hook" argument must be a function');
  }

  var next = function (err, result, args) {
    setTimeout(function () {
      hook(err, result, args);
    }, 0);
  };

  return function () {
    var args = Array.prototype.slice.call(arguments);
    try {
      var r = func.apply(null, args);
      if (!r || !r.then) {
        next(null, r, args);
        return r;
      }
      r.then(function (result) {
        next(null, result, args);
      }).catch(function (err) {
        next(err, undefined, args);
      });
      return r;
    } catch (err) {
      next(err, undefined, args);
      throw err;
    }
  };
};

