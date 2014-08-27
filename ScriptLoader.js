/*jshint esnext:true*/

import EventHandler from 'EventHandler';

/**
 *
 */
export default function ScriptLoader(options) {
    EventHandler.call(this);

    this.element = document.createElement('script');
    this.element.type = 'text/javascript';

    this.options = Object.create(ScriptLoader.OPTIONS);
    if (options)
        this.setOptions(options);
}

/**
 *
 */
ScriptLoader.OPTIONS = {
    timeout: 5000,
    url: ''
};

/**
 *
 */
ScriptLoader.Errors = Object.create(null);

/**
 *
 */
ScriptLoader.Errors.TIMEOUT = new Error('timeout');

/**
 *
 */
ScriptLoader.States = Object.create(null);

/**
 *
 */
ScriptLoader.States.INITIAL = 0;

/**
 *
 */
ScriptLoader.States.LOADING = 1;

/**
 *
 */
ScriptLoader.States.LOADED = 2;

/**
 *
 */
ScriptLoader.States.ERROR = 3;

/**
 *
 */
ScriptLoader.LISTENERS = Object.create(null);

/**
 *
 */
ScriptLoader.LISTENERS.load = function onLoad(event) {
    if (this.state === ScriptLoader.States.LOADING) {

        Object.defineProperty(this, 'state', {
            configurable: false,
            value: ScriptLoader.States.LOADED
        });

        this.triggerEvent('complete');
    }
    else
        event.stopImmediatePropagation();
};

/**
 *
 */
ScriptLoader.LISTENERS.error = function onError(event) {
    if (this.state === ScriptLoader.States.LOADING) {

        Object.defineProperty(this, 'state', {
            configurable: false,
            value: ScriptLoader.States.ERROR
        });

        Object.defineProperty(this, 'error', {
            value: new Error(event.message)
        });

        this.triggerEvent('complete');
    }
    else
        event.stopImmediatePropagation();
};

/**
 *
 */
ScriptLoader.LISTENERS.timeout = function onTimeout(event) {
    if (this.state === ScriptLoader.States.LOADING) {

        Object.defineProperty(this, 'state', {
            configurable: false,
            value: ScriptLoader.States.ERROR
        });

        Object.defineProperty(this, 'error', {
            value: ScriptLoader.Errors.TIMEOUT
        });

        this.triggerEvent('complete');
    }
    else
        event.stopImmediatePropagation();
};

/**
 *
 */
ScriptLoader.LISTENERS.complete = function onComplete(event) {
    if (this.state === ScriptLoader.States.LOADED ||
        this.state === ScriptLoader.States.ERROR) {

        this.element.removeEventListener('load', this, false);
        this.element.removeEventListener('error', this, false);

        if (this.state === ScriptLoader.States.ERROR)
            this.triggerEvent('error', this.error);
        else
            this.triggerEvent('load');

        this.triggerEvent('complete');
    }
    else
        event.stopImmediatePropagation();
};

/**
 *
 */
ScriptLoader.prototype = Object.create(EventHandler.prototype);

/**
 *
 */
ScriptLoader.prototype.constructor = ScriptLoader;

/**
 *
 */
Object.defineProperty(ScriptLoader.prototype, 'state', {
    value: ScriptLoader.States.INITIAL
});

/**
 *
 */
Object.defineProperty(ScriptLoader.prototype, 'error', {
    value: null
});

/**
 *
 */
ScriptLoader.prototype.setOptions = function setOptions(options) {
    for (var name in options) this.options[name] = options[name];
};

/**
 *
 */
ScriptLoader.prototype.load = function load() {
    if (this.state === ScriptLoader.States.INITIAL) {

        Object.defineProperty(this, 'state', {
            value: ScriptLoader.States.LOADING
        });

        this.element.src = this.options.url;
        this.element.addEventListener('load', this, false);
        this.element.addEventListener('error', this, false);

        document.getElementsByTagName('head')[0].appendChild(this.element);

        window.setTimeout(this.triggerEvent.bind(this, 'timeout'), this.options.timeout);
    }
};
