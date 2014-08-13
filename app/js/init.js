/**
 * Created with IntelliJ IDEA.
 * User: cooksha
 * Date: 7/27/14
 * Time: 12:30 PM
 */

function initDialogs() {
    $( "dialog" ).dialog({
        autoOpen: false,
        modal: true
    });
    $( "#sector_name_dlg" ).dialog( "option", "width", 730 );
    $( "#par-dlg" ).dialog( "option", "width", 400 );
    $( "#bnch-dlg" ).dialog( "option", "width", 400 );
    $( "#units-dlg" ).dialog( "option", "width", 855 );
}

function init() {
    initDialogs();
}

$( document ).ready(init);

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

Array.prototype.remByVal = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] === val) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
}

Array.prototype.findSectorByName = function(name) {
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i].name!='undefined' && this[i].name === name) {
            return i;
        }
    }
    return -1;
}

/*
 * If the key does not exist this set it to the given value. If
 * the key *does* exist then do not make any changes. Return
 * the resultant value - either the provided on or the previous
 * based on whatever is done to the array.
 */
Array.prototype.putIfAbsent = function(key, val) {
    if( typeof this[key] == 'undefined' ) {
        this[key] = val;
    }
    return this[key];
}


/*
 * Return the properties of this associative array as an array.
 */
Array.prototype.propertiesToArray = function() {
    var array = [];
    for (k in this)
    {
        if (this.hasOwnProperty(k))
        {
            array.push(this[k]);
        }
    }
    return array;
}

