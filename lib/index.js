var TimeQueue = require('timequeue');
var inherits = require('util').inherits;
var OrderedEmitter = require('ordered-emitter');


/**
 * @constructor
 * @extends {TimeQueue}
 * @param {Function(arg1, arg2, ..., callback)} worker
 * @param {!Object} options
 */
var OrderedQueue = module.exports = function OrderedQueue(worker, options) {
  TimeQueue.call(this, worker, options);

  var self = this;
  this._oe = new OrderedEmitter();
  this._oe.on('push', function(data) {
    TimeQueue.prototype.push.apply(self, data.args);
  });
};

inherits(OrderedQueue, TimeQueue);


/**
 * @overwrite
 * @param {Number} order
 * @param {Object} arg...
 * @param {!Function(!Error, arg1...)} callback
 */
OrderedQueue.prototype.push = function(order) {
  this._oe.emit('push', {
    order: order,
    args: Array.prototype.slice.call(arguments, 1)
  });
};


/**
 * Resets order of queue.
 */
OrderedQueue.prototype.reset = function() {
  this._oe.reset('push');
};
