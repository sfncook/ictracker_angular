
angular.module('AdapterServices', ['ParseAdapter', 'StaticAdapter'])

    .factory('AdapterStore', function(ParseAdapter, StaticAdapter) {
        return {
            adapter:{},
            init:function() {
                var adapter_id_str = getHttpRequestByName('adapter');

                if(adapter_id_str=="") {
                    console.log("Missing required 'adapter' parameter. Using default 'static' adapter.");
                    this.adapter = StaticAdapter;
                } else if(ParseAdapter.adapter_id_str == adapter_id_str) {
                    this.adapter = ParseAdapter;
                } else if(StaticAdapter.adapter_id_str == adapter_id_str) {
                    this.adapter = StaticAdapter;
                } else {
                    console.error("Invalid or unhandled adapter parameter: ",adapter);
                }

                if(this.adapter.init) {
                    return this.adapter.init();
                } else {
                    return null;
                }
            },
            isLoggedIn:         function()       {return this.adapter.isLoggedIn();},
            SaveSector:         function(sector) {return this.adapter.SaveSector(sector);},
            SaveReportAction:   function(sector, text) {return this.adapter.SaveReportAction(sector, text);}

        };
    })

;