var Select = require('./lib/select.js');
var Update = require('./lib/update.js');
var Insert = require('./lib/insert.js');
var Delete = require('./lib/delete.js');

module.exports.select = function() {
    return new Select();
};

module.exports.update = function() {
    return new Update();
};

module.exports.delete = function() {
    return new Delete();
};

module.exports.insert = function() {
    return new Insert();
};