Parse.initialize("Rx2vAi13xDnzOpbSCPZr3nAQycuQ7eA7k9JLhkxR", "1Qc5tKwXrMNm9tOlBsRw4VapXgNUHe9DIyNU9XMp");

document.addEventListener('click', function (event) {
    if ($(event.target).hasClass("disabled") || $(event.target).parents(".disabled").length > 0) {
        event.stopPropagation();
    }
}, true);

Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.remByVal = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}

/*
 * 'this' must be an array of tbar objects such that this.name is
 * the name of the sector.
 */
Array.prototype.findSectorByName = function (name) {
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i].name != 'undefined' && this[i].name === name) {
            return i;
        }
    }
    return -1;
}

/*
 * 'this' must be an array of tbar objects such that this.units is
 * an array of unit objects such that unit.name is the name of the
 * unit.
 */
Array.prototype.unitInSectors = function () {
    var units = [];
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i].units != 'undefined') {
            units = units.concat(this[i].units);
        }
    }
    return units;
}

/*
 * If the key does not exist this set it to the given value. If
 * the key *does* exist then do not make any changes. Return
 * the resultant value - either the provided on or the previous
 * based on whatever is done to the array.
 */
Array.prototype.putIfAbsent = function (key, val) {
    if (typeof this[key] == 'undefined') {
        this[key] = val;
    }
    return this[key];
}


/*
 * Return the properties of this associative array as an array.
 */
Array.prototype.propertiesToArray = function () {
    var array = [];
    for (k in this) {
        if (this.hasOwnProperty(k)) {
            array.push(this[k]);
        }
    }
    return array;
}

Array.prototype.clone = function () {
    return this.concat();
}

//
//var TestObject = Parse.Object.extend("TestObject");
//var testObject = new TestObject();
//testObject.save({foo: "bar"}).then(function(object) {
//    alert("yay! it worked");
//});
//
//var user = new Parse.User();
//user.set("username", "my name");
//user.set("password", "my pass");
//user.set("email", "email@example.com");
//
//// other fields can be set just like with Parse.Object
//user.set("phone", "650-555-0000");
//
//user.signUp(null, {
//    success: function(user) {
//        // Hooray! Let them use the app now.
//    },
//    error: function(user, error) {
//        // Show the error message somewhere and let the user try again.
//        alert("Error: " + error.code + " " + error.message);
//    }
//});
