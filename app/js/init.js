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
