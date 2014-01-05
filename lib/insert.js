var Base            = require('./base.js');
var util            = require('util');
var InsertBuilder   = require('./helper/insertbuilder.js');

function Insert() {
    this.table      = undefined;
    this.columns    = [];
    this.values     = [];
    this.builder    = new InsertBuilder();
}

util.inherits(Insert, Base);

Insert.prototype.into = function(table) {
    this.table = table;

    return this;
};

Insert.prototype.set = function(column, value) {
    if (typeof column === 'object') {
        for(name in column) {
            this.set(name, column[name]);
        }
    } else {
        this.columns.push(column);
        this.values.push(this.builder.formatValue(value));
    }

    return this;
};

Insert.prototype.toString = function() {
    var query = 'INSERT';

    /*
        Build INTO
     */
    query += this.builder.buildInto(this.table);

    /*
        Build columns
     */
    query += this.builder.buildColumns(this.columns);

    /*
        Build VALUES
     */
    query += this.builder.buildValues(this.values);

    return query;
};

module.exports = Insert;