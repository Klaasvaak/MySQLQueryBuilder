var util = require('util');
var BaseBuilder = require('./basebuilder.js');

function InsertBuilder() {
    InsertBuilder.super_.apply(this, arguments);
}

util.inherits(InsertBuilder, BaseBuilder);

InsertBuilder.prototype.buildInto = function(table) {
    if (table) {
        return ' INTO ' + this.quoteName(table);
    }

    return '';
};

InsertBuilder.prototype.buildColumns = function(columns) {
    var tmp = [];
    for (var i = 0; i < columns.length; i++) {
        tmp.push(this.quoteName(columns[i]));
    }
    return ' (' + tmp.join(', ') + ')';
};

InsertBuilder.prototype.buildValues = function(values) {
    return ' VALUES (' + values.join(', ') + ')';
};

module.exports = InsertBuilder;