
export default function Struct() {
    this._flags_ = {};
    this._state_ = {};
    this._cache_ = {};
    this._dirty_ = [];
}

Struct.PropertyTransforms = {

    toNumber: function(v) {
        return 'function(v){return isNaN(v=Number(v))?'+v+':v;}'
    }

};

Struct.define = function define(name, definition) {
    var c = 'return function '+name+'(o){var b=o!==void 0;this._={';
    var a = Object.keys(definition);
    var p = Object.create(Struct.prototype);
    for (var i = 0, l = a.length; i < l; ++i) {
        var k = a[i];
        var v = definition[k];
        var t = typeof v;
        var f;

        var get = 'return this._'+key+';';
        var set = 'var _=this._,$=_.'+key+';if($!==)';
        switch (typeof val) {
            case 'number': set += '(v=Number(v))&&!isNaN(v))';
            case 'string': set += '(v=String(v)))';
        }
        set += '{_.'+key+'=v;this.onDirty("'+key+'")}';
        Object.defineProperty(prototype, key, {
            get: new Function(get),
            set: new Function('v', set)
        });
    }
    c = new Function(c + '}};')();
    p.constructor = c;
    c.prototype = p;
    return c;
};

Struct.prototype.valueOf = function valueOf() {
    return this._;
};

Struct.prototype.isDirty = function isDirty() {

};

Struct.prototype.isClean = function isClean() {

};

Struct.prototype.onDirty = function onDirty() {

};

Struct.prototype.onClean = function onClean() {

};

var Point = Struct.define('Point', { x: 0, y: 0 });
