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
    $( "#sector-name-dlg" ).dialog( "option", "width", 800 );
    $( "#par-dlg" ).dialog( "option", "width", 400 );
    $( "#bnch-dlg" ).dialog( "option", "width", 400 );
    $( "#units-dlg" ).dialog( "option", "width", 855 );
}

function init() {
    initDialogs();
}

$( document ).ready(init);

