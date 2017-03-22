/* eslint-env node, mocha */

var assert = require('assert');
var sinon = require('sinon');
var after = require('after');
var hook = require('../');

describe('hook normal function', function () {

  it('shoud only one running', function (done) {
    var next = after(3, done);
    var sum = function (a, b) {
      return a + b;
    };
    var sumHook = hook(sum, function (err, result, args) {
      if (err) {
        next(err);
        return;
      }
      try {
        assert.equal(args[0] + args[1], result);
        next();
      } catch (e) {
        next(e);
      }
    });
    sumHook(1, 1);
    sumHook(2, 3);
    sumHook(4, 5);
  });

  it('exception callback', function (done) {
    var throwFn = function () {
      throw new Error('test');
    };
    var throwHook = hook(throwFn, function (err, result) {
      try {
        assert(err);
        done();
      } catch (e) {
        done(e);
      }
    });

    assert.throws(function () {
      throwHook();
    }, Error, 'should throw Error');
  });

  it('argument exception', function () {
    assert.throws(function () {
      hook({});
    }, TypeError, 'should throw TypeError');

    assert.throws(function () {
      hook(function () {}, []);
    }, TypeError, 'should throw TypeError');
  });

});

describe('solo async function ', function () {
  var pass = function (ms) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(ms);
      }, ms);
    });
  };

  var fail = function (ms) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        reject(new Error('test'));
      }, ms);
    });
  };

  it('promise resolve', function (done) {
    var next = after(2, done);
    var passHook = hook(pass, function (err, result) {
      next(err);
    });
    passHook().then(next);
  });

  it('promise reject', function (done) {
    var next = after(2, done);
    var failHook = hook(fail, function (err, result) {
      if (err) {
        next();
      }
    });
    failHook().catch(function (err) {
      if (err) {
        next();
      }
    });

  });

});

