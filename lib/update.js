var util            = require('util');
var Base            = require('./base.js');
var UpdateBuilder   = require('./helper/updatebuilder.js');


function Update() {
    Array.prototype.push.call(arguments, new UpdateBuilder());
    Update.super_.apply(this, arguments);

    this.tables     = [];
    this.values     = [];
    this.orders     = [];
}

util.inherits(Update, Base);

/**
 * Adds a table to the tables array.
 * @param table
 * @param alias
 * @returns {Update}
 */
Update.prototype.table = function(table, alias) {
    this.tables.push({
        table: table,
        alias: alias
    });

    return this;
};

/**
 * Add a value to the values array.
 * @param name
 * @param value
 * @returns {Update}
 */
Update.prototype.set = function(name, value) {
    this.values.push({
        name: name,
        value: value
    });

    return this;
};

/**
 * Adds order to order array.
 * @param field
 * @param direction true = ascending, false = descending
 */
Update.prototype.order = function(field, direction) {
    direction = direction === undefined ? true : direction;

    this.orders.push({
        field: field,
        direction: direction
    });

    return this;
};

/**
 * Creates the query as a String.
 * @returns {String} the query
 */
Update.prototype.toString = function() {
    var query = "UPDATE ";

    /*
        Build Table
     */
    query += this.builder.buildTable(this.tables);

    /*
        Build SET
     */
    query += this.builder.buildSet(this.values);

    /*
        Build WHERE
     */
    query += this.builder.buildWhere(this.wheres);

    /*
        Build ORDER
     */
    if (this.orders.length > 0) {
        var tmpOrders = [];
        var order = undefined;
        for(var i = 0; i < this.orders.length; i++) {
            order = this.orders[i];
            tmpOrders.push(this.builder.quoteName(order.field) + ' ' + (order.direction ? 'ASC' : 'DESC'));
        }

        query += ' ORDER BY ' + tmpOrders.join(', ');
    }

    /*
        Build LIMIT
     */
    query += this.builder.buildLimit(this.limitValue);

    return query;
};

module.exports = Update;