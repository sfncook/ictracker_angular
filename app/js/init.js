/*
 * This file is used to initialize all forms and should not be specialized.
 *  - Add features to JS object
 *  - Initialize Parse.com
 */

document.addEventListener('click', function (event) {
    //console.log("document.addEventListener('click')");
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

Array.prototype.removeAll = function () {
    while(this.length > 0) {
        this.pop();
    }
    return this;
}

/*
 * 'this' must be an array of tbar objects such that this.name is
 * the name of the sector.
 */
Array.prototype.findSectorByName = function (name) {
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i].sectorType.name != 'undefined' && this[i].sectorType.name === name) {
            return i;
        }
    }
    return -1;
}

/*
 * 'this' must be an array of tbar objects such that this.name is
 * the name of the sector.
 */
Array.prototype.findUnitByName = function (name) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].type && this[i].type.name && this[i].type.name === name) {
            return i;
        }
    }
    return -1;
}

/*
 * 'this' must be an array of objects that all have a 'name' attribute
 */
Array.prototype.findObjByName = function (name) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].name && this[i].name === name) {
            return this[i];
        }
    }
    return null;
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

String.prototype.isEmpty = function() {
    return (this.length === 0 || !this.trim());
};

function getHttpRequestByName(name) {
    get_string = document.location.search;
    return_value = '';

    do { //This loop is made to catch all instances of any get variable.
        name_index = get_string.indexOf(name + '=');

        if (name_index != -1) {
            get_string = get_string.substr(name_index + name.length + 1, get_string.length - name_index);

            end_of_value = get_string.indexOf('&');
            if (end_of_value != -1)
                value = get_string.substr(0, end_of_value);
            else
                value = get_string;

            if (return_value == '' || value == '')
                return_value += value;
            else
                return_value += ', ' + value;
        }
    } while (name_index != -1)

    //Restores all the blank spaces.
    space = return_value.indexOf('+');
    while (space != -1) {
        return_value = return_value.substr(0, space) + ' ' +
            return_value.substr(space + 1, return_value.length);

        space = return_value.indexOf('+');
    }

    return(return_value);
}//getHttpRequestByName

$(document).keyup(function (e) {
    //Esc Key Press
//    if (e.keyCode == 27) {
//        $("#mayday_form").hide();
//    }
});
