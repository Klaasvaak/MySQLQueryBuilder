var Formatter = require('./formatter.js');

function BaseBuilder() {

}

/**
 * Formats the given value. Escapes the value if it's a String.
 * @param value
 * @returns {String} the formatted value
 */
BaseBuilder.prototype.formatValue = function(value) {
    return Formatter.escape(value);
};

/**
 * Quotes the identifiers
 * @param value
 * @returns {string}
 */
BaseBuilder.prototype.quoteName = function(value) {
    return Formatter.escapeId(value);
};

/**
 * Builds the query JOIN part
 * @param {Array} joins
 * @returns {string}
 */
BaseBuilder.prototype.buildJoin = function(joins, Type) {
    var query = '';

    if (joins.length > 0) {
        var tmpJoins = [];
        var join = undefined;

        for(var i = 0; i < joins.length; i++) {
            join = joins[i];

			var tmp = '';
            tmp += ' ' + join.type;

            if (join.table instanceof Type) {
                tmp += ' JOIN (' + join.table.toString() + ')' + (join.alias ? ' AS ' + this.quoteName(join.alias) : '');
            } else {
                tmp += ' JOIN ' + this.quoteName(join.table) + (join.alias ? ' AS ' + this.quoteName(join.alias) : '');
            }

            if (join.condition) {
                tmp += ' ON (' + this.quoteName(join.condition) + ')';
            }

            tmpJoins.push(tmp);
        }

        query += tmpJoins.join('');
    }

    return query;
};

BaseBuilder.prototype.buildWhere = function(wheres) {
    var query = '';

    if (wheres.length > 0) {
        query += ' WHERE ' + wheres.join(' '); // Is already quoted
    }

    return query;
};

/**
 * Builds the query LIMIT part
 * @param limit
 * @returns {string}
 */
BaseBuilder.prototype.buildLimit = function(limit) {
    if (limit !== undefined) {
        return ' LIMIT ' + this.formatValue(limit);
    } else {
        return '';
    }
};



module.exports = BaseBuilder;
