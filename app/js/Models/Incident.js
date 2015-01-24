function Incident() // Constructor
{
}

Incident.model = ['inc_number','inc_address','inc_type','inc_startDate', 'sectors'];

function fetchTypeForIncident(incident, $scope) {
    var type = incident.inc_type;
    if(type) {
        type.fetch({
            success: function(type) {
                $scope.$apply(function(){
//                console.log(incident.inc_number+' - '+ type.get('icon')+" "+type.get('text')+" "+type.get('type'));
                    incident.inc_type_text = type.get('nameLong');
                    incident.inc_type_icon = type.get('icon');
                });
            }
        });
    }
}