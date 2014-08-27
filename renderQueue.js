/* jshint esnext:true */

// https://github.com/kof/animation-frame
// http://codetheory.in/controlling-the-frame-rate-with-requestanimationframe/

var root;

try {
    // Accessing name property will throw a SecurityError within a foreign domain.
    root = window.top.name;
    root = window.top;
} catch (error) {
    root = window;
}

var cue =
    root.requestAnimationFrame       ||
    root.webkitRequestAnimationFrame ||
    root.mozRequestAnimationFrame    ||
    root.oRequestAnimationFrame      ||
    root.msRequestAnimationFrame     ||
    function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };

var now = window.performance && window.performance.now ?
    function() {
        return window.performance.now();
    }:
    (function() {
        var now = Date.now || function() {
            return new Date().getTime();
        };
        var start = now();
        return function() {
            return now() - start;
        };
    }());

var queue = [];
var speed = 60;
var limit = 10000;
var interval = 1000 / speed;
var marker = now();

function flush(time) {
    var i = 0;
    while (i < queue.length) {
        queue[i++](time);
        if (i === limit) {
            queue.length = 0;
            throw new Error('maximum renderQueue size exceeded');
        }
    }
    queue.length = 0;
}

function clamp() {
    var time = now();
    var delta = time - marker;
    if (delta > interval) {
        flush(time);
        marker = time - (delta % interval);
    }
}

var renderQueue = Object.create({}, {

    fps: {
        enumerable: true,
        get: function() {
            return speed;
        },
        set: function(fps) {
            speed = fps;
            interval = 1000 / speed;
        }
    },

    maxSize: {
        enumerable: true,
        get: function() {
            return limit;
        },
        set: function(size) {
            limit = size;
        }
    },

    push: {
        value: function(callback) {
            if (queue.push(callback) === 1) cue(clamp);
        }
    }

});

export default renderQueue;
