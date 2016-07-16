var OrderedQueue    = require('..');
var assert = require('assert');


function createTest(fn, expected) {
  return function(done) {
    var output = [];
    var q = new OrderedQueue(function worker(a, callback) {
      output.push(a);
      setTimeout(callback, Math.floor(Math.random() * 50));
    }, { concurrency: 3 });

    q.on('drain', function() {
      assert.deepEqual(output, expected);
      done();
    });
    q.on('error', done);
    fn(q);
  };
}

describe('Push tasks with order', function() {

  it('Worker gets called in desired order', createTest(function(q) {
    q.push(4, 4);
    q.push(3, 3);
    q.push(2, 2);
    q.push(1, 1);
    q.push(0, 0);
    q.push(6, 6);
    q.push(5, 5);
  }, [0, 1, 2, 3, 4, 5, 6]));

  describe('Reset in the middle', function() {
    it('Worker gets called correctly', createTest(function(q) {
      q.push(2, 2);
      q.push(2, 2);
      q.push(1, 1);
      q.push(1, 1);
      q.push(0, 0);
      q.push(0, 0);
      q.reset();
      q.push(2, 2);
      q.push(2, 2);
      q.push(1, 1);
      q.push(1, 1);
      q.push(0, 0);
      q.push(0, 0);
    }, [0, 1, 2, 0, 1, 2]));
  });
});
