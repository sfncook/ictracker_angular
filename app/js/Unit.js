function Unit(name, type, city) // Constructor
{
    this.name = name;
    this.type = type;
    this.city = city;
    this.par = 'P';
    this.psi = 4000;
    this.actions = [];
    this.manyPeopleHavePar = 0;
    this.hasPar = false;
}

Unit.prototype.toggleAction = function(action)
{
    if(this.actions.contains(action)) {
        this.actions.remByVal(action);
    } else {
        this.actions.push(action);
    }
}

Unit.prototype.setPar = function(newPar) {
    this.manyPeopleHavePar = newPar;

    if(this.manyPeopleHavePar == this.par) {
        this.hasPar = true;
    } else {
        this.hasPar = false;
    }
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
}

Unit.prototype.setHasPar = function(newHasPar) {
    this.hasPar = newHasPar;
    if(this.hasPar) {
        this.manyPeopleHavePar = this.par;
    } else {
        this.manyPeopleHavePar = 0;
    }
}