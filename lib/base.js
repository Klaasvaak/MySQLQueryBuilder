var BaseBuilder = require('./helper/basebuilder.js');

function Base(builder) {
    this.wheres         = [];
    this.limitValue     = undefined;
    this.builder        = builder || new BaseBuilder();
}

/**
 * Adds the where to the wheres array.
 * @param {String} condition
 * @params {String|Array} values...
 * @returns {Base}
 */
Base.prototype.where = function() {
    var condition = this.builder.quoteName(arguments[0]);
    arguments = Array.prototype.slice.call(arguments, 0);
    var values = arguments.length > 1 ? arguments.slice(1) : [];

    var value = undefined;
    for (var i = 0; i < values.length; i++) {
        value = values[i];

        if (Array.isArray(value)) {
            var arrValues = [];

            for(var j = 0; j < value.length; j++) {
                arrValues.push(this.builder.formatValue(value[j]));
            }

            value = '(' + arrValues.join(', ') + ')';
        } else {
            value = this.builder.formatValue(value);
        }

        condition = condition.replace('?', value);
    }

    this.wheres.push(condition);

    return this;
};

/**
 * Adds the join to the joins array.
 * @param table
 * @param alias
 * @param condition
 * @param type default INNER
 * @returns {Base}
 */
Base.prototype.join = function(table, alias, condition, type) {
    type = type ? type.trim().toUpperCase() : 'INNER';

    this.joins.push({
        table: table,
        alias: alias,
        condition: condition,
        type: type
    });

    return this;
};

/**
 * Sets the limits.
 * @param limit
 * @returns {Base}
 */
Base.prototype.limit = function(limit) {
    this.limitValue = limit;

    return this;
};

/**
 * Adds the group to the group array.
 * @param field
 * @returns {Base}
 */
Base.prototype.group = function(field) {
    this.groups.push(field);

    return this;
};

/**
 * Adds the having to the having array.
 * @param having
 * @returns {Base}
 */
Base.prototype.having = function(having) {
    var condition = this.builder.quoteName(arguments[0]);
    arguments = Array.prototype.slice.call(arguments, 0);
    var values = arguments.length > 1 ? arguments.slice(1) : [];

    var value = undefined;
    for (var i = 0; i < values.length; i++) {
        value = values[i];

        if (Array.isArray(value)) {
            var arrValues = [];

            for(var j = 0; j < value.length; j++) {
                arrValues.push(this.builder.formatValue(value[j]));
            }

            value = '(' + arrValues.join(', ') + ')';
        } else {
            value = this.builder.formatValue(value);
        }

        condition = condition.replace('?', value);
    }

    this.havings.push(condition);

    return this;
};

/**
 * Adds order to order array.
 * @param field
 * @param direction true = ascending, false = descending
 * @returns {Base}
 */
Base.prototype.order = function(field, direction) {
    direction = direction === undefined ? true : direction;

    this.orders.push({
        field: field,
        direction: direction
    });

    return this;
};



module.exports = Base;