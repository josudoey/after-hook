module.exports = function (func, hook) {
  if (typeof func !== 'function') {
    throw new TypeError('"func" argument must be a function');
  }
  if (typeof hook !== 'function') {
    throw new TypeError('"hook" argument must be a function');
  }

  var resolve = function (result) {
    setTimeout(function () {
      hook(null, result);
    }, 0);
  };

  var reject = function (err) {
    setTimeout(function () {
      hook(err);
    }, 0);
  };

  return function () {
    var args = Array.prototype.slice.call(arguments);
    try {
      var r = func.apply(null, args);
      if (!r || !r.then) {
        resolve(r);
        return r;
      }
      r.then(resolve).catch(reject);
      return r;
    } catch (err) {
      reject(err);
      throw err;
    }
  };
};

