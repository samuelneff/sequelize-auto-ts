/// <reference path='../typings/node/node.d.ts' />

import generator = require('../lib/sequelize-auto-ts');
import fs = require('fs');
import path = require('path');
var prompt = require('prompt');

console.log('Generate Sequelize types and models for MySQL World database.');

var schema = {
    properties: {
        username: { description: 'Username', required: true },
        password: { description: 'Password', required: false, hidden: true }
    }
};

prompt.start();

prompt.get(schema, function(err, result)
{
    result.options = null;
    result.database = 'world';
    result.targetDirectory = path.join(__dirname, 'mysql-world-generated');


    generate(<generator.GenerateOptions>result);

});

function generate(options:generator.GenerateOptions):void
{
    console.log('Database: ' + options.database);
    console.log('Username: ' + options.username);
    console.log('Password: <hidden>');
    console.log('Target  : ' + options.targetDirectory);
    console.log('');

    if (!fs.existsSync(options.targetDirectory))
    {
        fs.mkdir(options.targetDirectory);
    }

    generator.generate(options, function(err)
    {
        if (err)
        {
            throw err;
        }
    });
}

