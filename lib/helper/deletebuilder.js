var BaseBuilder = require('./basebuilder.js');
var util        = require('util');

function DeleteBuilder() {
    DeleteBuilder.super_.apply(this, arguments);
}

util.inherits(DeleteBuilder, BaseBuilder);

/**
 * Builds the FROM part of the query
 * @param {Object} from
 * @returns {string}
 */
DeleteBuilder.prototype.buildFrom = function(from, Type) {
    var query = '';

    if (from && from.name) {
        var table = undefined;

        if (from.name instanceof Type) {
            table = '(' + from.name.toString() + ')' + (from.alias ? ' AS ' + this.quoteName(from.alias) : '');
        } else {
            table = this.quoteName(from.name) + (from.alias ? ' AS ' + this.quoteName(from.alias) : '');
        }

        query += ' FROM ' + table;
    }

    return query;
};

/**
 * Builds the WHERE part of the query
 * @param {Object} from
 * @returns {string}
 */
DeleteBuilder.prototype.buildWhere = function(wheres) {
    var query = '';

    if (wheres.length > 0) {
        query += ' WHERE ' + wheres.join(' '); // Is already quoted
    }

    return query;
};

module.exports = DeleteBuilder;