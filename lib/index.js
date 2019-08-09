const TimeQueue      = require('timequeue');
const OrderedEmitter = require('ordered-emitter');


module.exports = class OrderedQueue extends TimeQueue {
  /**
   * @constructor
   * @extends {TimeQueue}
   * @param {Function(arg1, arg2, ..., callback)} worker
   * @param {!Object} options
   */
  constructor(worker, options) {
    super(worker, options);

    this._oe = new OrderedEmitter();
    this._oe.on('push', (data) => {
      super.push(...data.args);
    });
  }


  /**
   * @overwrite
   * @param {number} order
   * @param {Object} ...arg
   * @param {!Function(!Error, ...args)} callback
   */
  push(order, ...args) {
    this._oe.emit('push', { order, args });
  }


  /**
   * Resets order of queue.
   */
  reset() {
    this._oe.reset('push');
  }
};
