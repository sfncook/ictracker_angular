/**
 * Created with IntelliJ IDEA.
 * User: cooksha
 * Date: 7/27/14
 * Time: 12:30 PM
 */

angular.module("ictApp", []);

function addTbar() {
    var tbar = $("#sector_prototype").clone().appendTo("body");

    tbar.find(".par-btn").click(function(){$("#par-dlg").dialog( "open" );});

//    tbar.find(".sector-name-btn").click(function(){
//        $("#sector-name-dlg").dialog( "open" );
//    });

    tbar.find(".bnch-btn").click(function(){$("#bnch-dlg").dialog( "open" );});

    tbar.find(".unit-add-btn").click(function(){
        $("#units-dlg").data("tbar_selected", tbar);
        $("#units-dlg").dialog( "open" );
    });
    tbar.show();
}

function initTbars() {
    $("#sector_prototype").hide();

    addTbar();
    addTbar();
    addTbar();
}

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
    initTbars();
}

$( document ).ready(init);

