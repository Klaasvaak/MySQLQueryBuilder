var chai = require('chai');
var expect = chai.expect;
var update = require('../index.js').update;

/*
 * Tested queries:
 * UPDATE `students` SET `name` = 'Jon'
 * UPDATE `students` AS `tbl` SET `tbl`.`name` = 'Jon', `tbl`.`score` = 3
 * UPDATE `students` AS `st`, `schools` AS `sc` SET `st`.`name` = 'Jon'
 * UPDATE `students` AS `st`, `schools` AS `sc` SET `st`.`name` = 'Jon'
 * UPDATE `students` AS `st` SET `st`.`name` = 'Jon' WHERE `st`.`name` = 'Not Jon' LIMIT 5
 * UPDATE `students` AS `st` SET `st`.`name` = 'Jon' WHERE `st`.`name` = 'Not Jon' ORDER BY `st`.`name` ASC LIMIT 5
*/

describe('Update', function() {
    it("UPDATE `students` SET `name` = 'Jon'", function() {
        var q = update()
            .table('students')
            .set('name', 'Jon')
            .toString();
        expect(q).to.be.equal("UPDATE `students` SET `name` = 'Jon'");
    });

    it("UPDATE `students` AS `tbl` SET `tbl`.`name` = 'Jon', `tbl`.`score` = 3", function() {
        var q = update()
            .table('students', 'tbl')
            .set('tbl.name', 'Jon')
            .set('tbl.score', 3)
            .toString();
        expect(q).to.be.equal("UPDATE `students` AS `tbl` SET `tbl`.`name` = 'Jon', `tbl`.`score` = 3");
    });

    it("UPDATE `students` AS `st`, `schools` AS `sc` SET `st`.`name` = 'Jon'", function() {
        var q = update()
            .table('students', 'st')
            .table('schools', 'sc')
            .set('st.name', 'Jon')
            .toString();
        expect(q).to.be.equal("UPDATE `students` AS `st`, `schools` AS `sc` SET `st`.`name` = 'Jon'");
    });

    it("UPDATE `students` AS `st`, `schools` AS `sc` SET `st`.`name` = 'Jon'", function() {
        var q = update()
            .table('students', 'st')
            .table('schools', 'sc')
            .set('st.name', 'Jon')
            .toString();
        expect(q).to.be.equal("UPDATE `students` AS `st`, `schools` AS `sc` SET `st`.`name` = 'Jon'");
    });

    it("UPDATE `students` AS `st` SET `st`.`name` = 'Jon' WHERE `st`.`name` = 'Not Jon' LIMIT 5", function() {
        var q = update()
            .table('students', 'st')
            .set('st.name', 'Jon')
            .where('st.name = ?', 'Not Jon')
            .limit(5)
            .toString();
        expect(q).to.be.equal("UPDATE `students` AS `st` SET `st`.`name` = 'Jon' WHERE `st`.`name` = 'Not Jon' LIMIT 5");
    });

    it("UPDATE `students` AS `st` SET `st`.`name` = 'Jon' WHERE `st`.`name` = 'Not Jon' ORDER BY `st`.`name` ASC LIMIT 5", function() {
        var q = update()
            .table('students', 'st')
            .set('st.name', 'Jon')
            .where('st.name = ?', 'Not Jon')
            .order('st.name', true)
            .limit(5)
            .toString();
        expect(q).to.be.equal("UPDATE `students` AS `st` SET `st`.`name` = 'Jon' WHERE `st`.`name` = 'Not Jon' ORDER BY `st`.`name` ASC LIMIT 5");
    });
});