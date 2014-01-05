function BaseBuilder() {

}

var quote = function(value, ignore, index, total) {
    var result = '';

    value = value.trim();

    // special cases
    if (value === '*') {
        return value;
    }

    var pos = undefined;
    if ((pos = value.indexOf('.')) !== -1) {
        var table = quote(value.substring(0, pos));
        var column = quote(value.substring(pos + 1));

        result = table + '.' + column;
    } else {
        result = '`' + value + '`';
    }

    return result;
};

/**
 * Formats the given value. Escapes the value if it's a String.
 * @param value
 * @returns {String} the formatted value
 */
BaseBuilder.prototype.formatValue = function(value) {
    if (value === null) {
        value = 'NULL';
    } else if (typeof value === ' boolean') {
        value = value ? 'TRUE' : 'FALSE';
    } else if (typeof value !== 'number') {
        value = "'" + value + "'";
        //TODO: escape?
    }

    return value;
};

/**
 * Quotes the identifiers
 * @param value
 * @returns {string}
 */
BaseBuilder.prototype.quoteName = function(value) {
    value = value.trim();

    // Get all lower case parts. Can include #-_.0-9
    return value.replace(/\b([a-z0-9\.\#\-_]+)\b/g, quote);
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
        var tmp = '';

        for(var i = 0; i < joins.length; i++) {
            join = joins[i];

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

/**
 * Builds the query LIMIT part
 * @param limit
 * @returns {string}
 */
BaseBuilder.prototype.buildLimit = function(limit) {
    if (limit !== undefined) {
        return ' LIMIT ' + limit;
    } else {
        return '';
    }
};



module.exports = BaseBuilder;