

function incTxId_mayday(request) {
    query = new Parse.Query("Incident");
    query.get(request.object.get("incident").id, {
        success: function(incident) {
            incident.increment("txid");
            incident.save();
        },
        error: function(error) {
            console.error("Got an error saving Incident " + error.code + " : " + error.message);
        }
    });
}
Parse.Cloud.afterSave("Mayday", incTxId_mayday);
Parse.Cloud.afterDelete("Mayday", incTxId_mayday);


function incTxId_sector(request) {
    query = new Parse.Query("Incident");
    query.get(request.object.get("incident").id, {
        success: function(incident) {
            incident.increment("txid");
            incident.save();
        },
        error: function(error) {
            console.error("Got an error saving Sector " + error.code + " : " + error.message);
        }
    });
}
Parse.Cloud.afterSave("Sector", incTxId_sector);
Parse.Cloud.afterDelete("Sector", incTxId_sector);


function incTxId_unit(request) {
    query = new Parse.Query("Sector");
    query.get(request.object.get("sector").id, {
        success: function(sector) {
            queryInc = new Parse.Query("Incident");
            queryInc.get(sector.get("incident").id, {
                success: function(incident) {
                    incident.increment("txid");
                    incident.save();
                },
                error: function(error) {
                    console.error("Got an error saving Unit (save Incident) " + error.code + " : " + error.message);
                }
            });
        },
        error: function(error) {
            console.error("Got an error saving Unit (find Sector)" + error.code + " : " + error.message);
        }
    });
}
Parse.Cloud.afterSave("Unit", incTxId_unit);
Parse.Cloud.afterDelete("Unit", incTxId_unit);
