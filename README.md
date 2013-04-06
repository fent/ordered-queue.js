# ordered-queue.js [![Build Status](https://secure.travis-ci.org/fent/ordered-queue.js.png)](http://travis-ci.org/fent/ordered-queue.js)

Queue with concurrency that starts tasks in order and runs them in parallel.


# Usage

```js
var OrderedQueue = require('ordered-queue');
var q = new OrderedQueue(function worker(str, callback) {
  console.log(str);
  callback();
}, { concurrency: 10 });

q.push(3, 'fox');
q.push(1, 'quick');
q.push(0, 'the');
q.push(2, 'brown');

// Will print:
//
// the
// quick
// brown
// fox
//
```


# API

### new OrderedQueue(worker, [options])

Creates a new ordered queue with given worker and concurrency. This inherits from [timequeue](https://github.com/fent/timequeue.js), so it will have all properties, methods, and events from it. Only the `TimeQueue#push()` method is rewritten.

### OrderedQueue#push(order, args1, arg2, ..., callback)

`order` must be an integer that determines the order of the task. The `callback` is optional, will be called once task finishes if provided. All arguments inbetween will be passed to the worker.


# Install

    npm install ordered-queue


# Tests
Tests are written with [mocha](http://visionmedia.github.com/mocha/)

```bash
npm test
```

# License
MIT
