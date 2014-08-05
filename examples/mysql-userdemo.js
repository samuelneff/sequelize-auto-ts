/// <reference path='../typings/node/node.d.ts' />
var generator = require('../lib/sequelize-auto-ts');
var fs = require('fs');
var path = require('path');
var prompt = require('prompt');

console.log('Generate Sequelize types and models for MySQL UserDemo (custom) database.');

var schema = {
    properties: {
        username: { description: 'Username', required: true },
        password: { description: 'Password', required: false, hidden: true }
    }
};

prompt.start();

prompt.get(schema, function (err, result) {
    result.options = null;
    result.database = 'UserDemo';
    result.targetDirectory = path.join(__dirname, 'mysql-userdemo-generated');

    generate(result);
});

function generate(options) {
    console.log('Database: ' + options.database);
    console.log('Username: ' + options.username);
    console.log('Password: <hidden>');
    console.log('Target  : ' + options.targetDirectory);
    console.log('');

    if (!fs.existsSync(options.targetDirectory)) {
        fs.mkdir(options.targetDirectory);
    }

    generator.generate(options, function (err) {
        if (err) {
            throw err;
        }
    });
}
//# sourceMappingURL=mysql-userdemo.js.map
