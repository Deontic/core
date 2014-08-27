/* jshint esnext:true */

export default function Renderer() {
    this._queued = {};
}

Renderer.prototype.enqueue = function(key, value) {
    if (!this._queued[key]) {
        var method = this[key];
        if (typeof method === 'function') {
            if (!this.hasOwnProperty(key)) this[key] = method.bind(this);
            this._flags[key] = true;
            renderQueue.push()
        }
        this._queued[key] = true;
        updateQueue.push(this[key]);
    }

    RenderQueue.push(function() {

    });
};
