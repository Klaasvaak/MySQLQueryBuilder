var BaseBuilder = require('./basebuilder.js');
var util        = require('util');

function UpdateBuilder() {
    UpdateBuilder.super_.apply(this, arguments);
}

util.inherits(UpdateBuilder, BaseBuilder);

UpdateBuilder.prototype.buildTable = function(tables) {
    var query = '';

    if (tables.length > 0) {
        var table = undefined;
        var tmp = [];

        for (var i = 0; i < tables.length; i++) {
            table = tables[i];
            tmp.push(this.quoteName(table.table) + (table.alias ? ' AS ' + this.quoteName(table.alias) : ''));
        }

        query += tmp.join(', ');
    }

    return query;
};

UpdateBuilder.prototype.buildSet = function(values) {
    var query = '';

    if (values.length > 0) {
        var value = undefined;
        var tmp = [];

        for (var i = 0; i < values.length; i++) {
            value = values[i];

            tmp.push(this.quoteName(value.name) + ' = ' + this.formatValue(value.value));
        }

        query += ' SET ' + tmp.join(', ');
    }

    return query;
};

module.exports = UpdateBuilder;