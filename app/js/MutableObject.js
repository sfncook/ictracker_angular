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
    this.txSwitches = {};
}

MutableObject.prototype.get = function (attr) {
    return this[attr];
}

MutableObject.prototype.set = function (attr, value) {
    this[attr] = value;

    if(this.txSwitches[attr]) {
        txs.push(new Tx("set", attr, value));
    }
}

MutableObject.prototype.add = function (attr, value) {
    this[attr].push(value);

    if(this.txSwitches[attr]) {
        txs.push(new Tx("add", attr, value));
    }
}

MutableObject.prototype.remByVal = function (attr, value) {
    this[attr].remByVal(value);

    if(this.txSwitches[attr]) {
        txs.push(new Tx("remByVal", attr, value));
    }
}

MutableObject.prototype.addTxSwitch = function (attr, isOn) {
    this.txSwitches[attr] = isOn || true;
}

