const OrderedQueue = require('..');
const assert       = require('assert');
const sinon        = require('sinon');


let clock;
before(() => { clock = sinon.useFakeTimers(); });
after(() => { clock.restore(); });

const createTest = (fn, expected) => {
  return (done) => {
    let output = [];
    let q = new OrderedQueue((a, callback) => {
      output.push(a);
      let time = Math.floor(Math.random() * 50);
      setTimeout(callback, time);
      process.nextTick(() => {
        clock.tick(time);
      });
    }, { concurrency: 3 });

    q.on('drain', () => {
      assert.deepEqual(output, expected);
      done();
    });
    q.on('error', done);
    fn(q);
  };
};

describe('Push tasks with order', () => {

  it('Worker gets called in desired order', createTest((q) => {
    q.push(4, 4);
    q.push(3, 3);
    q.push(2, 2);
    q.push(1, 1);
    q.push(0, 0);
    q.push(6, 6);
    q.push(5, 5);
  }, [0, 1, 2, 3, 4, 5, 6]));

  describe('Reset in the middle', () => {
    it('Worker gets called correctly', createTest((q) => {
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
