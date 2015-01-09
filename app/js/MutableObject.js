/**
 * Created with IntelliJ IDEA.
 * User: cooksha
 * Date: 1/7/15
 * Time: 8:29 AM
 * To change this template use File | Settings | File Templates.
 */

function MutableObject() {
    this.handlers = {
        'set':[]
    };
}

MutableObject.prototype.get = function (attr) {
    return this[attr];
}

MutableObject.prototype.set = function (attr, value) {
    this[attr] = value;
    console.log(this.handlers['set']);
}

MutableObject.prototype.addHandlerForSet = function (func) {
    this.handlers['set'].push(func);
}

