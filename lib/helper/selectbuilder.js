var BaseBuilder = require('./basebuilder.js');
var util        = require('util');

function SelectBuilder() {
    SelectBuilder.super_.apply(this, arguments);
}

util.inherits(SelectBuilder, BaseBuilder);

/**
 * Builds the fields and DISTINCT part of the query
 * @param {Array} fields
 * @param {bool} distinct
 * @returns {string}
 */
SelectBuilder.prototype.buildFields = function(fields, distinct, Type) {
    var query = '';

    if (fields.length > 0) {
        if (distinct) {
            query += ' DISTINCT';
        }

        var columns = [];
        var field = undefined;
        for (var i = 0; i < fields.length; i++) {
            field = fields[i];

            if (field.name instanceof Type) {
                columns.push('(' + field.name.toString() + ')' + (field.alias ? ' AS ' + this.quoteName(field.alias) : ''));
            } else {
                columns.push(this.quoteName(field.name) + (field.alias ? ' AS ' + this.quoteName(field.alias) : ''));
            }
        }

        query += ' ' + columns.join(', ')
    } else {
        query += ' *';
    }

    return query;
};

/**
 * Builds the FROM part of the query
 * @param {Object} from
 * @returns {string}
 */
SelectBuilder.prototype.buildFrom = function(from, Type) {
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

SelectBuilder.prototype.buildWhere = function(wheres) {
    var query = '';

    if (wheres.length > 0) {
        query += ' WHERE ' + wheres.join(' '); // Is already quoted
    }

    return query;
};

/**
 * Builds the query LIMIT part
 * @param limit
 * @param offset
 * @returns {string}
 */
SelectBuilder.prototype.buildLimit = function(limit, offset) {
    if (limit !== undefined) {
        return ' LIMIT ' + this.formatValue(offset) + ', ' + this.formatValue(limit);
    } else {
        return '';
    }
};

module.exports = SelectBuilder;