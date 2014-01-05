MySQLQueryBuilder
=======
### TODOS
* delete
* show
* tests for inner queries
* test with mysql driver
* expressions
* configuration (quotechar, table prefix)
* escape function

This is a query builder for MySQL for Node.js which follows some rules (see rules). If you want a query builder for something more than just MySQL or if you do not like the rules you could take a look at: http://hiddentao.github.io/squel

### Install
    $ npm install mysql-querybuilder

Or add as dependency in your package.json

### Rules
* SQL Commands should be in uppercase
* Table and field names should be in lowercase

### Running the tests
* clone project
* mkdir node_modules in the project root
* npm install chai
* mocha should be installed globally (npm install -g mocha)
* run: mocha

### Examples
For more examples see the tests.

**Require**

    var Builder = require('mysql-querybuilder');

**Select**

    // SELECT * FROM `table`
    Builder.select()
        .from('table')
        .toString();

    // SELECT `tbl`.`name` FROM `table` AS `tbl`
    Builder.select()
        .field('tbl.name')
        .from('table', 'tbl')
        .toString();

    // SELECT `tbl`.`id` FROM `students` AS `tbl` INNER JOIN `schools` AS `s` ON (`s`.`id` = `tbl`.`id`) WHERE `tbl`.`name` LIKE '%Jon%' GROUP BY `tbl`.`id`, `tbl`.`name` HAVING `tbl`.`score` > 9 ORDER BY `tbl`.`name` ASC, `tbl`.`id` DESC LIMIT 10, 50
    Builder.select()
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

**Update**

    // UPDATE `students` SET `name` = 'Jon'
    Builder.update()
        .table('students')
        .set('name', 'Jon')
        .toString();

    // UPDATE `students` AS `tbl` SET `tbl`.`name` = 'Jon', `tbl`.`score` = 3
    Builder.update()
        .table('students', 'tbl')
        .set('tbl.name', 'Jon')
        .set('tbl.score', 3)
        .toString();

**Insert**

    // INSERT INTO `students` (`name`) VALUES ('Jon')
    Builder.insert()
        .into('students')
        .set('name', 'Jon')
        .toString();

    // INSERT INTO `students` (`name`, `score`) VALUES ('Jon', 10)
    Builder.insert()
        .into('students')
        .set('name', 'Jon')
        .set('score', 10)
        .toString();

    //INSERT INTO `students` (`name`, `score`, `school`) VALUES ('Jon', 10, NULL)
    Builder.insert()
        .into('students')
        .set('name', 'Jon')
        .set('score', 10)
        .set('school', null)
        .toString();