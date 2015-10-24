

function incTxId(request) {
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
Parse.Cloud.afterSave("Mayday", incTxId);
Parse.Cloud.afterDelete("Mayday", incTxId);


Parse.Cloud.afterSave("Sector", incTxId);
Parse.Cloud.afterDelete("Sector", incTxId);

Parse.Cloud.afterSave("Iap", incTxId);
Parse.Cloud.afterDelete("Iap", incTxId);

Parse.Cloud.afterSave("Objectives", incTxId);
Parse.Cloud.afterDelete("Objectives", incTxId);

Parse.Cloud.afterSave("OSR", incTxId);
Parse.Cloud.afterDelete("OSR", incTxId);

Parse.Cloud.afterSave("Upgrade", incTxId);
Parse.Cloud.afterDelete("Upgrade", incTxId);


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


