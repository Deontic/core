/* jshint esnext:true */

var queue = [];
var limit = 10000;

function flush() {
    var i = 0;
    while (i < queue.length) {
        queue[i++]();
        if (i === limit) {
            queue.length = 0;
            throw new Error('maximum updateQueue size exceeded');
        }
    }
    queue.length = 0;
}

var cue = window.setImmediate;

if (!cue) {

    if (typeof MessageChannel !== 'undefined') {
         var channel = new MessageChannel();
         channel.port1.onmessage = flush;
         cue = function() {
             channel.port2.postMessage(0);
         };
    }
    else
        cue = function(flush) {
            window.setTimeout(flush, 0);
        };

}

var updateQueue = Object.create({}, {

    maxSize: {
        get: function() {
            return maxSize;
        },
        set: function(size) {
            limit = size;
        }
    },

    push: {
        value: function(callback) {
            if (queue.push(callback) === 1) cue(flush);
        }
    }

});

export default updateQueue;
