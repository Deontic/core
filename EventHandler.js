/*jshint esnext:true*/

/**
 * @private
 * @type {Object}
 */
var empty = Object.create(null);

/**
 * @private
 * @type {Array}
 */
var dispatch = [];

/**
 * Create an EventHandler
 *
 * @public
 * @constructor
 */
export default function EventHandler() {
    /**
     * @private
     * @type {Object}
     */
    this._event_ = Object.create(this.constructor.LISTENERS || EventHandler.LISTENERS);
}

/**
 * @public
 * @type {Object}
 */
EventHandler.LISTENERS = Object.create(null);

/**
 * Test whether the EventHandler has at least one listener of the the given type
 *
 * @public
 * @param {String} type
 * @returns {Boolean}
 */
EventHandler.prototype.hasListener = function hasListener(type) {
    return type in this._event_;
};

/**
 * Add an EventListener to the EventHandler for the given type
 *
 * @public
 * @param {String} type
 * @param {Function|EventListener} listener
 * @returns undefined
 */
EventHandler.prototype.addListener = function addListener(type, listener) {
    if (typeof listener === 'function' ||
       (listener && typeof listener.handleEvent === 'function')) {
           var listeners = this._event_;
           if (listeners.hasOwnProperty(type))
               listeners[type].push(listener);
           else if (listeners[type] === void 0)
               listeners[type] = [listener];
           else
               listeners[type] = listeners[type].concat(listener);
       }
};

/**
 * Add an EventListener to the EventHandler for the given type
 *
 * @public
 * @param {String} type
 * @param {Function|EventListener} listener
 * @returns undefined
 */
EventHandler.prototype.on = EventHandler.prototype.addListener;

/**
 * Remove a previously added EventListener from the EventHandler for the given type
 *
 * @public
 * @param {String} type
 * @param {Function|EventListener} listener
 * @returns undefined
 */
EventHandler.prototype.removeListener = function removeListener(type, listener) {
    var listeners = this._event_[type];
    if (listeners) {
        var index = listeners.indexOf(listener);
        if (index !== -1) {
            if (this._event_.hasOwnProperty(type)) {
                if (listeners.length === 1)
                    this._event_[type] = null;
                else
                    listeners.splice(index, 1);
            }
            else if (listeners.length === 1)
                this._event_[type] = null;
            else {
                var result = this._event_[type] = [];
                for (var i = 0, l = listeners.length; i < l; ++i) {
                    if (index !== i) result.push(listeners[i]);
                }
            }
        }
    }
};

/**
 * Trigger an Event of the given type with optional data
 *
 * @public
 * @param {String} type
 * @param {Object} [event]
 * @returns undefined
 */
EventHandler.prototype.triggerEvent = function triggerEvent(type, event) {
    var listeners = this._event_[type];
    if (listeners) {
        if (event === void 0) {
            event = empty[type];
            if (event === void 0)
                event = empty[type] = { type: type };
        }
        var l = listeners.length, i;
        for (i = 0; i < l; ++i) dispatch[i] = listeners[i];
        for (i = 0; i < l; ++i) {
            var listener = dispatch[i];
            if (typeof listener === 'function')
                listener.call(this, event);
            else
                listener.handleEvent(event);
        }
    }
    if (type !== '*')
        this.triggerEvent('*', event);
};

/**
 * Trigger an extant Event on this EventHandler
 *
 * @public
 * @param {Event} event
 * @returns undefined
 */
EventHandler.prototype.handleEvent = function handleEvent(event) {
    this.triggerEvent(event.type, event);
};
