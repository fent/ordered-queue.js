'use strict';

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
      super.push.apply(this, data.args);
    });
  }


  /**
   * @overwrite
   * @param {Number} order
   * @param {Object} arg...
   * @param {!Function(!Error, arg1...)} callback
   */
  push(order) {
    this._oe.emit('push', {
      order,
      args: Array.prototype.slice.call(arguments, 1),
    });
  }


  /**
   * Resets order of queue.
   */
  reset() {
    this._oe.reset('push');
  }
};
