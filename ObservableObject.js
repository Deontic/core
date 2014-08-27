/*jshint esnext:true evil:true*/

export default function ObservableObject(properties) {
    this._state_ = Object.create(this.constructor.PROPERTIES || ObservableObject.PROPERTIES);
    this._cache_ = {};
    this._flags_ = {};
    this._dirty_ = [];

    this._event_ = Object.create(this.constructor.OBSERVERS || ObservableObject.OBSERVERS);

    if (properties)
        this.setProperties(properties);
}

ObservableObject.prototype.hasProperty = function hasProperty(name) {
    return name in this._state_;
};

ObservableObject.prototype.hasProperties = function hasProperties(names) {
    for (var i = 0, l = names.length; i < l; ++i) {
        if (!this.hasProperty(names[i])) return false;
    }
    return true;
};

ObservableObject.prototype.has = function has(names) {
    return typeof names === 'string' ? this.hasProperty(names) : this.hasProperties(names);
};

ObservableObject.prototype.getProperty = function getProperty(name) {
    return this._state_[name];
};

ObservableObject.prototype.getProperties = function getProperties(names) {
    var properties = {};
    if (names === void 0)
        for (var key in this._state_) {
            properties[key] = this._state_[key];
        }
    else
        for (var i = 0, l = names.length; i < l; i++) {
            var name = names[i];
            properties[name] = this.getProperty(name);
        }
    return properties;
};

ObservableObject.prototype.get = function get(names) {
    return typeof names === 'string' ? this.getProperty(names) : this.getProperties(names);
};

ObservableObject.prototype.setProperty = function setProperty(name, value) {
    if (value !== void 0) {
        var state = this._state_;
        var asset = state[name];
        if (asset !== value) {
            state[name] = value;
            var flags = this._flags_;
            if (flags[name]) {
                if (this._cache_[name] === value) {
                    flags[name] = false;
                    var dirty = this._dirty_;
                    if (dirty.length === 1) {
                        dirty.length = 0;
                        this.triggerEvent('clean');
                    }
                    else
                        dirty.splice(dirty.indexOf(name), 1);
                }
            }
            else {
                flags[name] = true;
                this._cache_[name] = asset;
                if (this._dirty_.push(name) === 1) this.triggerEvent('dirty');
            }
        }
    }
    return this;
};

ObservableObject.prototype.setProperties = function setProperties(properties) {
    var names = Object.keys(properties || {});
    for (var i = 0, l = names.length; i < l; i++) {
        var name = names[i];
        this.setProperty(name, properties[name]);
    }
    return this;
};

ObservableObject.prototype.set = function set(name, value) {
    return typeof name === 'string' ? this.setProperty(name, value) : this.setProperties(name);
};

ObservableObject.prototype.hasObserver = function hasObserver(name) {
    return this.hasListener(name + ':changed');
};

ObservableObject.prototype.addObserver = function addObserver(name, observer) {
    this.addListener(name + ':changed', observer);
};

ObservableObject.prototype.observe = ObservableObject.prototype.addObserver;

ObservableObject.prototype.removeObserver = function removeObserver(name, observer) {
    this.removeListener(name + ':changed', observer);
};

ObservableObject.prototype.unobserve = ObservableObject.prototype.removeObserver;

ObservableObject.prototype.notifyObservers = function notifyObservers(name, oldValue) {
    if (this.hasObserver(name))
        this.triggerEvent(name + ':changed', {
            oldValue: oldValue,
            newValue: this.getProperty(name)
        });
};

ObservableObject.prototype.pullChanges = function pullChanges() {
    var flags = this._flags_;
    var state = this._state_;
    var cache = this._cache_;

    return Object.keys(flags).map(function(name) {
        var oldValue = cache[name];
        var newValue = state[name];

        cache[name] = state[name];

        return {
            name: name,
            oldValue: oldValue,
            newValue: newValue
        };
    });


    var names = Object.keys(flags);
    for (var i = 0, l = names.length; i < l; ++i) {
        var name = names[i];
        flags[name] = false;
        changes.push({
            name: name,
            oldValue: cache[name],
            newValue: cache[name]
        });
        cache[name] = state[name];
    }
};

ObservableObject.prototype.flushChanges = function flushChanges() {
    var flags = this._flags_;
    var state = this._state_;
    var cache = this._cache_;
    var names = Object.keys(flags);
    for (var i = 0, l = names.length; i < l; ++i) {
        var name = names[i];
        flags[name] = false;
        cache[name] = state[name];
    }
    if (l > 0)
        this.triggerEvent('clean');
};








/*jshint evil:true*/

Deontic = Deontic || {};

(function() {

    'use strict';

    var EventHandler = Deontic.EventHandler;

    if (typeof EventHandler === 'undefined')
        throw new Error();

    function StateHandler(properties) {
        EventHandler.call(this);
        this._cache_ = {};
        this._flags_ = {};
        var defaults = this.constructor.PROPERTIES || StateHandler.PROPERTIES;
        var state = this._state_ = Object.create(defaults);
        var dirty = this._dirty_ = [];
        var names = Object.keys(defaults);
        for (var i = 0, l = names.length; i < l; ++i) dirty[names[i]] = false;
        if (properties !== void 0) {
            names = Object.keys(properties);
            for (i = 0, l = names.length; i < l; ++i) {
                var name = names[i];
                state[name] = properties[name];
            }
        }
    }

    StateHandler.PROPERTIES = Object.create(null);

    StateHandler.CONSTRUCTORS = Object.create(null);

    StateHandler.define = function define(definition) {
        function State(properties) {
            Super.call(this, properties);
        }
        var State$_ = State.prototype;
        var State$PROPERTIES = Object.create(Super.PROPERTIES);
        definition = definition || {};
        var names = Object.keys(definition);
        for (var i = 0, l = names.length; i < l; ++i) {
            var name = names[i];
            var descriptor = definition[name];
            if (typeof descriptor !== 'object' || descriptor === null)
                descriptor = { value: descriptor };
            if (descriptor.value !== void 0) {
                State.PROPERTIES[name] = descriptor.value;
                Object.defineProperty(State$_, name, {
                    get: new Function('return this._state_['+name+'];'),
                    set: new Function('value', 'this.setProperty('+name+', value);')
                });
            }
            else if (typeof descriptor.get === 'function' ||
                     typeof descriptor.set === 'function') {
                var dependencies = descriptor.dependencies;
                if (dependencies) {
                    // TODO
                }
                else
                    Object.defineProperty(State$_, name, descriptor);
             }
        }
    };

    StateHandler.create = function create(type, properties) {
        var State = StateHandler[type];
        if (State !== void 0) return new State(properties);
        throw new Error('StateHandler<' + type + '> has not been defined');
    };

    StateHandler.prototype = Object.create(EventHandler.prototype);

    StateHandler.prototype.hasProperty = function hasProperty(name) {
        return name in this._state_;
    };

    StateHandler.prototype.hasProperties = function hasProperties(names) {
        for (var i = 0, l = names.length; i < l; ++i) {
            if (!this.hasProperty(names[i])) return false;
        }
        return true;
    };

    StateHandler.prototype.has = function has(names) {
        return typeof names === 'string' ?
            this.hasProperty(names):
            this.hasProperties(names);
    };

    StateHandler.prototype.getProperty = function getProperty(name) {
        return this._state_[name];
    };

    StateHandler.prototype.getProperties = function getProperties(names) {
        var properties = {};
        if (names === void 0) {
            for (var key in this._state_) properties[key] = this._state_[key];
        }
        else {
            for (var i = 0, l = names.length; i < l; i++) {
                var name = names[i];
                properties[name] = this.getProperty(name);
            }
        }
        return properties;
    };

    StateHandler.prototype.get = function get(names) {
        return typeof names === 'string' ?
            this.getProperty(names):
            this.getProperties(names);
    };

    StateHandler.prototype.setProperty = function setProperty(name, value) {
        if (value !== void 0) {
            var state = this._state_;
            var asset = state[name];
            if (asset !== value) {
                state[name] = value;
                var flags = this._flags_;
                if (flags[name]) {
                    if (this._cache_[name] === value) {
                        flags[name] = false;
                        var dirty = this._dirty_;
                        if (dirty.length === 1) {
                            dirty.length = 0;
                            this.triggerEvent('clean');
                        }
                        else
                            dirty.splice(dirty.indexOf(name), 1);
                    }
                }
                else {
                    flags[name] = true;
                    this._cache_[name] = asset;
                    if (this._dirty_.push(name) === 1) this.triggerEvent('dirty');
                }
            }
        }
        return this;
    };

    StateHandler.prototype.setProperties = function setProperties(properties) {
        var names = Object.keys(properties || {});
        for (var i = 0, l = names.length; i < l; i++) {
            var name = names[i];
            this.setProperty(name, properties[name]);
        }
        return this;
    };

    StateHandler.prototype.set = function set(name, value) {
        return typeof name === 'string' ?
            this.setProperty(name, value):
            this.setProperties(name);
    };

    StateHandler.prototype.hasObserver = function hasObserver(name) {
        return this.hasListener(name + ':changed');
    };

    StateHandler.prototype.addObserver = function addObserver(name, observer) {
        this.addListener(name + ':changed', observer);
    };

    StateHandler.prototype.observe = StateHandler.prototype.addObserver;

    StateHandler.prototype.removeObserver = function removeObserver(name, observer) {
        this.removeListener(name + ':changed', observer);
    };

    StateHandler.prototype.unobserve = StateHandler.prototype.removeObserver;

    StateHandler.prototype.isDirty = function isDirty(name) {
        return name === void 0 ? this._dirty_.length > 0 : !!this._flag_[name];
    };

    StateHandler.prototype.notifyChanges = function notifyChanges() {
        var names = this._dirty_;
        if (names.length > 0) {
            var cache = this._cache_;
            var flags = this._flags_;
            this._dirty_ = [];
            this._cache_ = {};
            for (var i = 0, l = names.length; i < l; ++i) {
                var name = names[i];
                flags[name] = false;
                if (this.hasObserver(name)) {
                    var type = name + ':changed';
                    this.triggerEvent(type, {
                        type: type,
                        object: this,
                        oldValue: cache[name]
                    });
                }
            }
            this.triggerEvent('clean');
        }
    };

    Object.defineProperty(StateHandler.prototype, 'dirtyPropertyNames', {
        get: function() {
            return this._dirty_.slice();
        }
    });

    Object.defineProperty(StateHandler.prototype, 'propertyNames', {
        get: function() {
            return Object.keys(this._state_);
        }
    });

    Deontic.StateHandler = StateHandler;

}());
