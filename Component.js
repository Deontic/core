/* jshint esnext:true */

/*

    The lifecycle of the component is extensible and operates through
    the component's listeners. All components implement the EventHandler
    interface

*/

// a mixin adds functionality to the component and can hook into the components lifecycle.
/*
    {
        lifecycle: {
            created: function() {
                this.element = document.createElement('div');
            }
        },

        properties: {

        },

        prototype: {

        }
    }
*/

var Position = {
    x: 0,
    y: 0,
    position: {
        get: function() {

        },
        set: function() {

        }
    }
};

Component.define({

    extend: '',

    mixins: [
        Position,
        Size
    ],

    oncreate: {
        handleEvent: function() {

        }
    },

    onclick: function() {

    },

    x: 0,
    y: 0,

    position: {
        get: function() {
            return { x: this.x, y: this.y }
        },
        set: function() {

        }
    }

});

Deontic.defineModule('Component', ['EventHandler'], function() {

    //

    function isListener(object) {
        return typeof object === 'function' ||
            (listener && typeof listener.handleEvent === 'function');
    }

    var defineProperty = (function() {

        function defineProperty(constructor, name, descriptor) {

        }

        function defineAccessor(constructor, name, descriptor) {

        }

        function defineListener(constructor, type, listener) {

        }

        return function() {

            if (key.indexOf('on') === 0 && isListener(object))
                defineListener(constructor, name, object);

            else if (typeof object !== 'object' || object === null)
                defineProperty(constructor, name, { value: object });

            else if (typeof object.get === 'function' || typeof object.set === 'function')
                defineAccessor(constructor, name, object);

            else
                defineProperty(constructor, name, object);

        };

    }());

    //

    function Component() {

    }

    return Component;

});




import EventHandler from 'EventHandler';

export default function Component() {
    EventHandler.call(this);
}

Component.LISTENERS = {};

Component.PROPERTIES = {};

Component.COMPONENTS = {};

Component.define = function define(type, definition) {

    var extend = definition.extend;
    var mixins = definition.mixins;

    if (extend) {

    }

    if (mixins) {
        for (var i = 0, l = mixins.length; i < l; ++i) {
            var mixin = mixins[i];
            if (mixin) {
                if (typeof mixin === 'string') {

                }
                if (typeof mixin === 'function') {
                    mixin.call(constructor);
                    continue;
                }
                if (mixin.applyTo) {
                    mixin.applyTo(constructor);
                    continue;
                }
                for (var key in mixin) {

                }
            }
        }
    }



    var definers = {

        listener: function(constructor, type, listener) {

        },

        property: function(constructor, name, value) {
            this.descriptor(constructor, name, { value: value });
        },

        descriptor: function(constructor, name, value) {
            constructor
            Object.defineProperty(constructor.prototype, name, {
                get: new Function('return this._properties.' + name),
                set: new Function('value', 'this.setProperty("' + name + '", value)')
            });
        }

    };

    var keys = Object.keys(definition);
    for (var i = 0, l = keys.length; i < l; ++i) {
        var key = keys[i];
        var descriptor = definition[key];
        if (key.indexOf('on') === 0 && typeof descriptor === 'function' ||
           (descriptor && typeof descriptor.handleEvent === 'function')) {
                key = key.slice(2);
                if (key in listeners)
                    listeners[key].push(descriptor);
                else
                    listeners[key] = [descriptor];
           }
        else if ()
    }




    if (definition.extend) {

    }

    if (definition.mixins) {
        var mixins = mixins

        for (var i = 0, l = definition.mixins.length; i < l; ++i) {

            var mixin = definition.mixins[i];

            if (typeof definition.mixins[i] === 'string') {

            }
            else if (definition.mixins)
        }
    }

    for (var name in definition) {

        if ()

    }

};

Component.create = function create() {

};

Component.prototype = Object.create(EventHandler.prototype);

Component.prototype.constructor = Component;

Component.prototype.addListener = function addListener() {

};

Component.prototype.removeListener = function removeListener() {

};

Component.prototype.triggerEvent = function triggerEvent(type, data) {

};
