/* jshint esnext:true */

export default function HTMLRenderer(element) {
    this.element = typeof element === 'string' ? document.createElement(element) : element;
    this.matrix4 = [0,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0];
}

HTMLRenderer.prototype = Object.create(Renderer.prototype);

HTMLRenderer.prototype.constructor = HTMLRenderer;

HTMLRenderer.prototype.matrix = function(value) {
    var m = this.matrix4;
    this.element.style.transform = 'matrix3d(' +
        m[0]  + ',' + m[1]  + ',' + m[2]  + ',' + m[3]  + ',' +
        m[4]  + ',' + m[5]  + ',' + m[6]  + ',' + m[7]  + ',' +
        m[8]  + ',' + m[9]  + ',' + m[10] + ',' + m[11] + ',' +
        m[12] + ',' + m[13] + ',' + m[14] + ',' + m[15] +
    ')';
};

HTMLRenderer.prototype.x = function renderX(value) {
    this.matrix4[13] = value;
    this.enqueue('matrix');


    this.element.style.left = value + 'px';
};

HTMLRenderer.prototype.y = function renderY(value) {
    this.element.style.top = value + 'px';
};

HTMLRenderer.prototype.width = function renderWidth(value) {
    this.element.style.width = value + 'px';
};

HTMLRenderer.prototype.height = function renderHeight(value) {
    this.element.style.height = value + 'px';
};

HTMLRenderer.prototype.opacity = function renderOpacity(value) {
    this.element.style.opacity = '' + value;
};

HTMLRenderer.prototype.backgroundColor = function backgroundColor(value) {
    this.element.style.backgroundColor = (value.length === 3 ? 'rgba' : 'rgb') + '(' + value + ')';
};
