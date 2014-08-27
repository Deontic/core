/* jshint esnext:true */

export function Context() {

}

Context.create = function create(description) {



};

Context.prototype = Object.create(Component.prototype);

Context.prototype.constructor = Context;

Context.prototype.addComponent = function addComponent() {

};
