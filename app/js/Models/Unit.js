var UnitParseObj = Parse.Object.extend("Unit");

Unit.prototype.toggleAction = function(action)
{
    if(this.actions.contains(action)) {
        this.actions.remByVal(action);
    } else {
        this.actions.push(action);
    }
}

// boolean storeObj - true=store object on backend, false=do not
function Unit(name, type, city, storeObj) // Constructor
{
    this.name = name;
    this.type = type;
    this.city = city;
    this.par = 'P';
    this.psi = 4000;
    this.actions = [];
    this.manyPeopleHavePar = 0;
    this.hasPar = false;

    this.storeObj = storeObj||false;
    if(this.storeObj) {
        this.parseObj = new UnitParseObj();
        this.updateParse();
    }
}

Unit.prototype.updateParse = function() {
    if(this.storeObj && ENABLE_SERVER_COMM) {
        this.parseObj.set("name", this.name);
        this.parseObj.set("type", this.type);
        this.parseObj.set("city", this.city);
        this.parseObj.set("par", this.par);
        this.parseObj.set("psi", this.psi);
        this.parseObj.set("actions", this.actions);
        this.parseObj.set("manyPeopleHavePar", this.manyPeopleHavePar);
        this.parseObj.set("hasPar", this.hasPar);
        this.parseObj.save();
    }
}

Unit.prototype.setPar = function(newPar) {
    this.manyPeopleHavePar = newPar;

    if(this.manyPeopleHavePar == this.par) {
        this.hasPar = true;
    } else {
        this.hasPar = false;
    }
    this.updateParse();
}

Unit.prototype.toggleHasPar = function() {
    if(this.manyPeopleHavePar == this.par) {
        this.manyPeopleHavePar = 0;
    } else {
        this.manyPeopleHavePar = this.par;
    }
    if(this.manyPeopleHavePar == this.par) {
        this.hasPar = true;
    } else {
        this.hasPar = false;
    }
    this.updateParse();
}

Unit.prototype.setHasPar = function(newHasPar) {
    this.hasPar = newHasPar;
    if(this.hasPar) {
        this.manyPeopleHavePar = this.par;
    } else {
        this.manyPeopleHavePar = 0;
    }
    this.updateParse();
}