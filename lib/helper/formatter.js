/*Copyright (c) 2012 Felix Geisendörfer (felix@debuggable.com) and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/

/*
Changes:
    function Formatter.escapeId to quote lower cases.
*/

function Formatter() {

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

Formatter.escapeId = function (value) {
    value = value.trim();

    // Get all lower case parts. Can include #-_.0-9
    return value.replace(/\b([a-z0-9\.\#\-_]+)\b/g, quote);
};

Formatter.escape = function(val, stringifyObjects, timeZone) {
    if (val === undefined || val === null) {
        return 'NULL';
    }

    switch (typeof val) {
        case 'boolean': return (val) ? 'true' : 'false';
        case 'number': return val+'';
    }

    if (val instanceof Date) {
        val = Formatter.dateToString(val, timeZone || 'local');
    }

    if (Buffer.isBuffer(val)) {
        return Formatter.bufferToString(val);
    }

    if (Array.isArray(val)) {
        return Formatter.arrayToList(val, timeZone);
    }

    if (typeof val === 'object') {
        if (stringifyObjects) {
            val = val.toString();
        } else {
            return Formatter.objectToValues(val, timeZone);
        }
    }

    val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
        switch(s) {
            case "\0": return "\\0";
            case "\n": return "\\n";
            case "\r": return "\\r";
            case "\b": return "\\b";
            case "\t": return "\\t";
            case "\x1a": return "\\Z";
            default: return "\\"+s;
        }
    });
    return "'"+val+"'";
};

Formatter.arrayToList = function(array, timeZone) {
    return array.map(function(v) {
        if (Array.isArray(v)) return '(' + Formatter.arrayToList(v, timeZone) + ')';
        return Formatter.escape(v, true, timeZone);
    }).join(', ');
};

Formatter.format = function(sql, values, stringifyObjects, timeZone) {
    values = [].concat(values);

    return sql.replace(/\?\??/g, function(match) {
        if (!values.length) {
            return match;
        }

        if (match == "??") {
            return Formatter.escapeId(values.shift());
        }
        return Formatter.escape(values.shift(), stringifyObjects, timeZone);
    });
};

Formatter.dateToString = function(date, timeZone) {
    var dt = new Date(date);

    if (timeZone != 'local') {
        var tz = convertTimezone(timeZone);

        dt.setTime(dt.getTime() + (dt.getTimezoneOffset() * 60000));
        if (tz !== false) {
            dt.setTime(dt.getTime() + (tz * 60000));
        }
    }

    var year = dt.getFullYear();
    var month = zeroPad(dt.getMonth() + 1, 2);
    var day = zeroPad(dt.getDate(), 2);
    var hour = zeroPad(dt.getHours(), 2);
    var minute = zeroPad(dt.getMinutes(), 2);
    var second = zeroPad(dt.getSeconds(), 2);
    var millisecond = zeroPad(dt.getMilliseconds(), 3);

    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond;
};

Formatter.bufferToString = function(buffer) {
    var hex = '';
    try {
        hex = buffer.toString('hex');
    } catch (err) {
        // node v0.4.x does not support hex / throws unknown encoding error
        for (var i = 0; i < buffer.length; i++) {
            var byte = buffer[i];
            hex += zeroPad(byte.toString(16));
        }
    }

    return "X'" + hex+ "'";
};

Formatter.objectToValues = function(object, timeZone) {
    var values = [];
    for (var key in object) {
        var value = object[key];
        if(typeof value === 'function') {
            continue;
        }

        values.push(Formatter.escapeId(key) + ' = ' + Formatter.escape(value, true, timeZone));
    }

    return values.join(', ');
};

function zeroPad(number, length) {
    number = number.toString();
    while (number.length < length) {
        number = '0' + number;
    }

    return number;
}

function convertTimezone(tz) {
    if (tz == "Z") return 0;

    var m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
    if (m) {
        return (m[1] == '-' ? -1 : 1) * (parseInt(m[2], 10) + ((m[3] ? parseInt(m[3], 10) : 0) / 60)) * 60;
    }
    return false;
}

module.exports = Formatter;