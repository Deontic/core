/* jshint esnext:true */

import Observable from 'Observable';

import renderQueue from 'renderQueue';

export default function Renderable(value) {
    Observable.call(this, value);
}

Renderable.prototype = Object.create(Observable.prototype);

Renderable.prototype.constructor = Renderable;

Renderable.prototype.notifyObservers = function notifyObservers() {
    if (this._callback !== null && !this._enqueued) {
        this._enqueued = true;
        renderQueue.push(this._callback);
    }
};
