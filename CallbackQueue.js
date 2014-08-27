/* jshint esnext:true */

var _NO_OPERATION;

export default function CallbackQueue(onActive) {

    var array = [];
    var limit = 10000;
    var activate = onActive || _NO_OPERATION;

    Object.defineProperties(this, {

        push: {
            configurable: true,
            writable: true,
            value: function push(callback) {
                if (array.push(callback) === 1) activate.call(this);
            }
        },

        flush: {
            configurable: true,
            writable: true,
            value: function flush() {
                var index = 0;
                while (array.length > index) {
                    array[index]();
                    if (++index === limit) {
                        array.length = 0;
                        throw new Error('reached callback limit: ' + limit);
                    }
                    index++;
                }
                array.length = 0;
            }
        },

        onactive: {
            configurable: true,
            writable: true,
            enumerable: true,
            get: function() {
                return activate;
            },
            set: function(onActive) {
                activate = onActive;
            }
        },

        limit: {
            configurable: true,
            writable: true,
            enumerable: true,
            get: function() {
                return limit;
            },
            set: function(value) {
                limit = value || 1;
            }
        }

    });

}
