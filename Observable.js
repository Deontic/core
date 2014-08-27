/* jshint esnext:true */

import updateQueue from 'updateQueue';

function send(observer) {
    if (this._observers === null) {
        this._enqueued = false;
        observer(this._value);
    }
    else
        this._callback();
}

var callbacks = [];

function emit() {
    var value = this._value;
    var observers = this._observers;
    if (observers !== null) {
        var l = observers.length;
        this._enqueued = false;
        if (l === 2) {
            callbacks[0] = observers[0];
            callbacks[1] = observers[1];
            observers.length = 0;
            callbacks[0](value);
            callbacks[1](value);
        }
        else if (l === 3) {
            callbacks[0] = observers[0];
            callbacks[1] = observers[1];
            callbacks[2] = observers[2];
            observers.length = 0;
            callbacks[0](value);
            callbacks[1](value);
            callbacks[2](value);
        }
        else if (l === 4) {
            callbacks[0] = observers[0];
            callbacks[1] = observers[1];
            callbacks[2] = observers[2];
            callbacks[3] = observers[3];
            observers.length = 0;
            callbacks[0](value);
            callbacks[1](value);
            callbacks[2](value);
            callbacks[3](value);
        }
        else {
            var i;
            for (i = 0; i < l; ++i) callbacks[i] = observers[i];
            observers.length = 0;
            for (i = 0; i < l; ++i) callbacks[i](value);
        }
    }
    else if (this._callback !== null)
        this._callback();
}

function callback() {
    this._enqueued = false;

    var observers = this._observers;

    switch (this._observers.length) {
        case 1:
            send(this._observers[0], this._value); break;
        case 0:
            break;
        default:
            emit(this._observers, this._value);
    }

    if (this._observers.length === 1)
        send(this._observers[0], this._value);
    else
        emit(this._observers, this._value);
}

export default function Observable(value) {
    this._value = value === void 0 ? null : value;
    this._callback = null;
    this._enqueued = false;
    this._observers = null;
}

Observable.prototype.addObserver = function addObserver(observer) {
    if (typeof observer === 'function') {
        if (this._observers !== null) {
            this._observers.push(observer);
        }
        else if (this._callback === null) {
            this._callback = send.bind(this, observer);
            this._callback.observer = observer;
        }
        else {
            this._observers = [this._callback.observer, observer];
            this._callback = emit.bind(this);
        }
    }
};

Observable.prototype.removeObserver = function removeObserver(observer) {
    if (this._callback !== null) {
        if (this._callback.observer === observer) {
            this._callback = null;
        }
        else if (this._observers !== null) {
            var index = this._observers.indexOf(observer);
            if (index !== -1) {
                this._observers.splice(index, 1);
                if (this._observers.length === 1) {
                    this._callback = send.bind(this, this._observers[0]);
                    this._callback.observer = this._observers[0];
                    this._observers = null;
                }
            }
        }
    }
};

Observable.prototype.notifyObservers = function notifyObservers() {
    if (this._callback !== null && !this._enqueued) {
        this._enqueued = true;
        updateQueue.push(this._callback);
    }
};

Observable.prototype.valueOf = function valueOf() {
    return this._value;
};

Observable.prototype.toString = function toString() {
    return String(this.valueOf());
};

Object.defineProperty(Observable.prototype, 'value', {
    get: Observable.prototype.valueOf,
    set: function(value) {
        if (value !== this._value) {
            this._value = value;
            this.notifyObservers();
        }
    }
});
