/**
 * Created with IntelliJ IDEA.
 * User: cooksha
 * Date: 7/27/14
 * Time: 12:30 PM
 */

function initDialogs() {
    $( ".dialog" ).dialog({
        autoOpen: false,
        modal: true
    });
    $( "#sector_name_dlg" ).dialog( "option", "width", 730 );
    $( "#par-dlg" ).dialog( "option", "width", 475 );
    $( "#bnch_dlg" ).dialog( "option", "width", 515 );
    $( "#units_dlg" ).dialog( "option", "width", 855 );
    $( "#actions_dlg" ).dialog( "option", "width", 545 );
    $( "#upgrade_dlg" ).dialog( "option", "width", 328 );
    $( "#osr_dlg" ).dialog( "option", "width", 420 );
    $( "#objectives_dlg" ).dialog( "option", "width", 185 );
    $( "#iap_dlg" ).dialog( "option", "width", 616 );
    $( "#unit_options_dlg" ).dialog( "option", "width", 423 );
    $( "#address_dialog" ).dialog( "option", "width", 450 );
    $( "#reports_dlg" ).dialog( "option", "width", 550 );

    $(".ui-dialog .ui-dialog-titlebar-close").html("Close");

}

function init() {
    initDialogs();
}

document.addEventListener('click', function (event) {
    if ($(event.target).hasClass("disabled") || $(event.target).parents(".disabled").length > 0) {
        event.stopPropagation();
    }
}, true);

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

/*
 * 'this' must be an array of tbar objects such that this.name is
 * the name of the sector.
 */
Array.prototype.findSectorByName = function(name) {
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i].name!='undefined' && this[i].name === name) {
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
Array.prototype.unitInSectors= function() {
    var units = [];
    for (var i = 0; i < this.length; i++) {
        if (typeof this[i].units!='undefined') {
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

Array.prototype.clone = function() {
    return this.concat();
}
