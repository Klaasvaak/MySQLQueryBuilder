var chai = require('chai');
var expect = chai.expect;
var insert = require('../index.js').insert;

/*
 * Tested queries:
 * INSERT INTO `students` (`name`) VALUES ('Jon')
 * INSERT INTO `students` (`name`, `score`) VALUES ('Jon', 10)
 * INSERT INTO `students` (`name`, `score`, `school`) VALUES ('Jon', 10, NULL)
 * INSERT INTO `students` (`name`, `score`, `school`) VALUES ('Jon', 10, NULL) # With object
 */

describe('Insert', function() {
    it("INSERT INTO `students` (`name`) VALUES ('Jon')", function() {
        var q = insert()
            .into('students')
            .set('name', 'Jon')
            .toString();
        expect(q).to.be.equal("INSERT INTO `students` (`name`) VALUES ('Jon')");
    });

    it("INSERT INTO `students` (`name`, `score`) VALUES ('Jon', 10)", function() {
        var q = insert()
            .into('students')
            .set('name', 'Jon')
            .set('score', 10)
            .toString();
        expect(q).to.be.equal("INSERT INTO `students` (`name`, `score`) VALUES ('Jon', 10)");
    });

    it("INSERT INTO `students` (`name`, `score`, `school`) VALUES ('Jon', 10, NULL)", function() {
        var q = insert()
            .into('students')
            .set('name', 'Jon')
            .set('score', 10)
            .set('school', null)
            .toString();
        expect(q).to.be.equal("INSERT INTO `students` (`name`, `score`, `school`) VALUES ('Jon', 10, NULL)");
    });

    it("INSERT INTO `students` (`name`, `score`, `school`) VALUES ('Jon', 10, NULL) # With object", function() {
        var jon = {name: 'Jon', score: 10, school: null}
        var q = insert()
            .into('students')
            .set(jon)
            .toString();
        expect(q).to.be.equal("INSERT INTO `students` (`name`, `score`, `school`) VALUES ('Jon', 10, NULL)");
    });
});