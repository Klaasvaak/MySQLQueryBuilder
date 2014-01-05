var chai = require('chai');
var expect = chai.expect;
var select = require('../index.js').select;

/*
 * Tested queries:
 * SELECT * FROM `students`
 * SELECT * FROM `students` AS `tbl`
 * SELECT `id` FROM `students`
 * SELECT `tbl`.`id` FROM `students` AS `tbl`
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`id` = 1
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon'
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%'
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name`
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` DESC
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 0, 30
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50
 * SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50
 * SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50
 * SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50
 * SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` AS `s` ON (`s`.`id` = `tbl`.`id`) WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50
 * SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` AS `s` ON (`s`.`id` = `tbl`.`id`) WHERE `tbl`.`name` LIKE '%Jon%' OR `tbl`.`name` LIKE '%Joon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50
 */

describe('Select', function() {
    it('SELECT * FROM `students`', function() {
        var q = select()
            .from('students')
            .toString();
        expect(q).to.be.equal('SELECT * FROM `students`');
    });

    it('SELECT * FROM `students` AS `tbl`', function() {
        var q = select()
            .from('students', 'tbl')
            .toString();
        expect(q).to.be.equal('SELECT * FROM `students` AS `tbl`');
    });

    it('SELECT `id` FROM `students`', function() {
        var q = select()
            .field('id')
            .from('students')
            .toString();
        expect(q).to.be.equal('SELECT `id` FROM `students`');
    });

    it('SELECT `tbl`.`id` FROM `students` AS `tbl`', function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .toString();
        expect(q).to.be.equal('SELECT `tbl`.`id` FROM `students` AS `tbl`');
    });

    it('SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`id` = 1', function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.id = ?', 1)
            .toString();
        expect(q).to.be.equal('SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`id` = 1');
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon'", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name = ?', 'Jon')
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` = 'Jon'");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%'", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%'");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name`", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .group('tbl.name')
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name`");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` DESC", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', false)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` DESC");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .order('tbl.id', false)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 0, 30", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .order('tbl.id', false)
            .limit(30)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 0, 30");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .order('tbl.id', false)
            .limit(50)
            .offset(10)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .join('schools')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .order('tbl.id', false)
            .limit(50)
            .offset(10)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .join('schools', null, null, 'inner')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .order('tbl.id', false)
            .limit(50)
            .offset(10)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` AS `s` ON (`s`.`id` = `tbl`.`id`) WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ?', '%Jon%')
            .join('schools', 's', 's.id = tbl.id', 'inner')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .order('tbl.id', false)
            .limit(50)
            .offset(10)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` AS `s` ON (`s`.`id` = `tbl`.`id`) WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50");
    });

    it("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` AS `s` ON (`s`.`id` = `tbl`.`id`) WHERE `tbl`.`name` LIKE '%Jon%' OR `tbl`.`name` LIKE '%Joon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50", function() {
        var q = select()
            .field('tbl.id')
            .from('students', 'tbl')
            .where('tbl.name LIKE ? OR tbl.name LIKE ?', '%Jon%', '%Joon%')
            .join('schools', 's', 's.id = tbl.id', 'inner')
            .group('tbl.id')
            .group('tbl.name')
            .having('tbl.score > ?', 9)
            .order('tbl.name', true)
            .order('tbl.id', false)
            .limit(50)
            .offset(10)
            .toString();
        expect(q).to.be.equal("SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` AS `s` ON (`s`.`id` = `tbl`.`id`) WHERE `tbl`.`name` LIKE '%Jon%' OR `tbl`.`name` LIKE '%Joon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50");
    });
});