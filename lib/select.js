var util            = require('util');
var Base            = require('./base.js');
var SelectBuilder   = require('./helper/selectbuilder.js');

function Select() {
    Array.prototype.push.call(arguments, new SelectBuilder());
    Select.super_.apply(this, arguments);

    this.distinct       = false;
    this.fields         = [];
    this.table          = undefined;
    this.joins          = [];
    this.wheres         = [];
    this.groups         = [];
    this.havings        = [];
    this.orders         = [];
    this.offsetValue    = 0;
}

util.inherits(Select, Base);

/**
 * Adds the name of the field and the alias to the fields array.
 * @param name
 * @param alias
 * @returns {Select}
 */
Select.prototype.field = function(name, alias) {
    this.fields.push({
        name: name,
        alias: alias
    });

    return this;
};

/**
 * Adds the names and aliases to the fields array.
 * @param array with objects containing attributes name and alias
 * @returns {Select}
 */
Select.prototype.fields = function(array) {
    var field = undefined;

    for(var i = 0; i < array.length; i++) {
        field = array[i];
        this.field(field.name, field.alias);
    }

    return this;
};

/**
 * Sets the table name and the alias.
 * @param table
 * @param alias
 * @returns {Select}
 */
Select.prototype.from = function(table, alias) {
    this.table = {
        name: table,
        alias: alias
    };

    return this;
};

/**
 * Sets the offset.
 * @param offset
 * @returns {Select}
 */
Select.prototype.offset = function(offset) {
    this.offsetValue = offset;

    return this;
};

/**
 * Creates the query as a String.
 * @returns {String} the query
 */
Select.prototype.toString = function() {
    var query = "SELECT";

    /*
        Build DISTINCT and fields.
     */
    query += this.builder.buildFields(this.fields, this.distinct, Select);

    /*
        Build FROM
     */
    query += this.builder.buildFrom(this.table, Select);

    /*
        Build JOIN
     */
    query += this.builder.buildJoin(this.joins, Select);

    /*
        Build WHERE
     */
    query += this.builder.buildWhere(this.wheres);

    /*
        Build GROUP
     */
    if (this.groups.length > 0) {
        var columns = [];

        for (var i = 0; i < this.groups.length; i++) {
            columns.push(this.builder.quoteName(this.groups[i]));
        }

        query += ' GROUP BY ' + columns.join(', ');
    }

    /*
        Build HAVING
     */
    if (this.havings.length > 0) {
        query += ' HAVING ' + this.havings.join(', '); // Is already quoted.
    }

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
    query += this.builder.buildLimit(this.limitValue, this.offsetValue);

    return query;
};

module.exports = Select;