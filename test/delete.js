var chai = require('chai');
var expect = chai.expect;
var Qdelete = require('../index.js').delete;

/*
 * Tested queries:
 * DELETE FROM `students`
 * DELETE FROM `students` AS `tbl`
 * DELETE FROM `students` AS `tbl` WHERE `tbl`.`id` = 1
 * DELETE FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon'
 * DELETE FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon' LIMIT 2
 */

describe('Delete', function() {
    it("DELETE FROM `students`", function() {
        var q = Qdelete()
            .from('students')
            .toString();
        expect(q).to.be.equal("DELETE FROM `students`");
    });

    it("DELETE FROM `students` AS `tbl`", function() {
        var q = Qdelete()
            .from('students', 'tbl')
            .toString();
        expect(q).to.be.equal("DELETE FROM `students` AS `tbl`");
    });

    it("DELETE FROM `students` AS `tbl` WHERE `tbl`.`id` = 1", function() {
        var q = Qdelete()
            .from('students', 'tbl')
            .where('tbl.id = ?', 1)
            .toString();
        expect(q).to.be.equal("DELETE FROM `students` AS `tbl` WHERE `tbl`.`id` = 1");
    });

    it("DELETE FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon'", function() {
        var q = Qdelete()
            .from('students', 'tbl')
            .where('tbl.name = ?', 'Jon')
            .toString();
        expect(q).to.be.equal("DELETE FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon'");
    });

    it("DELETE FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon' LIMIT 2", function() {
        var q = Qdelete()
            .from('students', 'tbl')
            .where('tbl.name = ?', 'Jon')
            .limit(2)
            .toString();
        expect(q).to.be.equal("DELETE FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon' LIMIT 2");
    });
});