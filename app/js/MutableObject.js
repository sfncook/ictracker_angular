/**
 * Created with IntelliJ IDEA.
 * User: cooksha
 * Date: 1/7/15
 * Time: 8:29 AM
 * To change this template use File | Settings | File Templates.
 */
var txs = new Array();

function MutableObject() {

}

MutableObject.prototype.init = function () {
    this.handlers = {
        'set':{}
    };
}

MutableObject.prototype.get = function (attr) {
    return this[attr];
}

MutableObject.prototype.set = function (attr, value) {
    this[attr] = value;

    if(this.handlers['set'][attr]) {
        for(var i=0; i<this.handlers['set'][attr].length; i++) {
            this.handlers['set'][attr][i](attr, value);
        }
    }
}

MutableObject.prototype.addHandlerForSet = function (attr, func) {
    if(typeof this.handlers['set'][attr]=='undefined') {
        this.handlers['set'][attr] = [];
    }
    this.handlers['set'][attr].push(func);
}

