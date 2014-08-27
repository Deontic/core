
Deontic.Component.define({

    x: {
        value: 0
    }

});








var _CONSTRUCTOR_BODY =
    'return function <name>(properties) {' +
    '    Component.call(this, properties);' +
    '}';

function _setupConstructor(constructor) {
    constructor.
}

function _createConstructor(name) {
    var functionBody = _CONSTRUCTOR_BODY.replace('<name>', name);
    var constructor = new Function('Component', functionBody)(Component);
    constructor.DEFAULT_STATE = Object.create(Component.DEFAULT_STATE);
    constructor.DEPENDENCY_MAP = Object.create(Component.DEPENDENCY_MAP);

}

function _defineProperty(constructor, descriptor) {

    if (typeof descriptor === )

}

export function Component(state) {
    this._dependencyMap = Object.create(this.constructor.DEPENDENCY_MAP || Component.DEPENDENCY_MAP);
    this._state = Object.create(this.constructor.DEFAULT_STATE);
    this._flags = {};
    if (state)
        for (var k in state) {
            this._flags[k] = false;
            if (this._state[k] === void 0) {
                Object.defineProperty(this, k, {

                });
            }

            this._state[k] = state[k];
        }

    for (var f in this._state) {
        this._flags[f] = true;
    }
}

Component.define = Component.defineComponent = function defineComponent(name, definition) {
    var constructor = _createConstructor(name);
};

Component.create = Component.createComponent = function createComponent(identifier, properties) {

};

Component.prototype.get = Component.prototype.getProperty = function getProperty(name) {
    return this[name];
};

Component.prototype.setProperty = function setProperty(name, value) {
    if (value !== void 0) {
        var cache = this._state[name];
        if (cache !== value) {
            this._state[name] = value;
            if (cache === void 0)
                Object.defineProperty(this, name, {
                    get: new Function('return this._state.' + name),
                    set: new Function('value', 'this.setProperty("' + name + '", value);')
                });
            this.notifyObservers(name);
        }
    }
};

Component.prototype.setProperties = function setProperties(properties) {
    if (typeof properties === 'object' && properties !== null)
        for (var name in properties) {
            this.setProperty(name, properties[name]);
        }
};

Component.prototype.set = function set(name, value) {
    if (typeof name === 'string')
        this.setProperty(name, value);
    else
        this.setProperties(name);
};

Component.prototype.addObserver = function addObserver() {

};







var rectangle = Component.compose([
    'draggable',
    ''
]);


var rectangle = new DisplayObject({
    options: {
        draggable: true
    },
    x: {
        renderable: true,
        observable: true,
        value: 0
    },
    y: {
        renderable: true,
        observable: true,
        value: 0
    },
    width: {
        renderable: true,
        observable: true,
        value: 0
    },
    height: {
        renderable: true,
        observable: true,
        value: 0
    }
});

var element = document.createElement('div');

rectangle.renderer = new HTMLRenderer(element);

rectangle.x = 20;
rectangle.y = 20;
rectangle.width = 200;
rectangle.height = 100;

element.style.left === '20px';

/* jshint esnext:true, evil:true */

import Observable from 'Observable';

import Renderable from 'Renderable';

export default function DisplayObject(properties) {

    var renderables = this._renderables = null;
    var observables = this._observables = null;

    this._renderer = null;

    if (properties !== void 0) {

        var keys = Object.keys(properties);

        for (var i = 0, l = keys.length; i < l; ++i) {

            var name = keys[i];
            var value = properties[name];

            if (typeof value !== 'object' || value === null) {
                this[name] = value;
            }
            else if (value.renderable) {

                this['_' + name] = new Renderable(value.value);

                Object.defineProperty(this, name, {
                    get: new Function('return this._' + name + ';'),
                    set: new Function('value', 'this._' + name + '.value = value;')
                });

                if (renderables === null)
                    renderables = this._renderables = [name];
                else
                    renderables.push(name);

            }
            else if (value.observable) {

                this['_' + name] = new Observable(value.value);

                Object.defineProperty(this, name, {
                    get: new Function('return this._' + name + ';'),
                    set: new Function('value', 'this._' + name + '.value = value;')
                });

                if (observables === null)
                    observables = this._observables = [name];
                else
                    observables.push(name);

            }
            else
                Object.defineProperty(this, name, value);
        }
    }
}

Object.defineProperty(DisplayObject.prototype, 'renderer', {

    get: function() {
        return this._renderer;
    },

    set: function(renderer) {

        var renderables = this._renderables;

        if (renderables !== null) {

            var l = renderables.length;
            var i, k, f;

            if (this._renderer !== null) {
                for (i = 0; i < l; i++) {
                    k = renderables[i];
                    f = this._renderer[k];
                    if (typeof f === 'function') this[k].removeObserver(f);
                }
            }

            this._renderer = renderer;

            for (i = 0; i < l; ++i) {
                k = renderables[i];
                f = renderer[k];
                if (typeof f === 'function') {
                    if (!renderer.hasOwnProperty(k)) renderer[k] = f.bind(renderer);
                    this[k].addObserver(f);
                }
            }
        }
    }
});
