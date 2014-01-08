var Select          = require('./select.js');
var Base            = require('./base.js');
var util            = require('util');
var DeleteBuilder   = require('./helper/deletebuilder.js');


function Delete() {
    Array.prototype.push.call(arguments, new DeleteBuilder());
    Delete.super_.apply(this, arguments);
    this.table          = undefined;
}

util.inherits(Delete, Base);

/**
 * Sets the table name and the alias.
 * @param table
 * @param alias
 * @returns {Delete}
 */
Delete.prototype.from = function(table, alias) {
    this.table = {
        name: table,
        alias: alias
    };

    return this;
};

/**
 * Creates the query as a String.
 * @returns {String} the query
 */
Delete.prototype.toString = function() {
    var query = "DELETE";

    /*
        Build FROM
     */
    query += this.builder.buildFrom(this.table, Select);

    /*
        Build WHERE
     */
    query += this.builder.buildWhere(this.wheres);

    /*
     Build LIMIT
     */
    query += this.builder.buildLimit(this.limitValue);

    return query;
};

module.exports = Delete;