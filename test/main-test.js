var OrderedQueue    = require('..');
var assert = require('assert');


describe('Push tasks with order', function() {
  var output = [];
  var q = new OrderedQueue(function worker(a, callback) {
    output.push(a);
    setTimeout(callback, Math.floor(Math.random() * 50));
  }, { concurrency: 3 });

  it('Worker gets called in desired order', function(done) {
    var expected = [0, 1, 2, 3, 4, 5, 6];

    q.on('drain', function() {
      assert.deepEqual(output, expected);
      done();
    });

    q.on('error', done);

    q.push(4, 4);
    q.push(3, 3);
    q.push(2, 2);
    q.push(1, 1);
    q.push(0, 0);
    q.push(6, 6);
    q.push(5, 5);
  });
});
