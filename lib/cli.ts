
/// <reference path="../typings/node/node.d.ts" />

import generator = require("./sequelize-auto-ts");
import fs = require("fs");
var prompt = require("prompt");

console.log("sequelize-auto-ts");
console.log("");
console.log("Automatically generate sequelize definition statements and TypeScript types for your database.")
console.log("");

if (process.argv.length > 2)
{
    processFromCommandLines();
}
else
{
    processFromPrompt();
}

function processFromCommandLines()
{
    var args:Array<string> = process.argv.slice(2);

    if (args.length < 4)
    {
        showHelp();
        process.exit(1);
    }

    var options:generator.GenerateOptions =
    {
        database: args[0],
        username: args[1],
        password: args[2],
        targetDirectory: args[3],
        options: null
    };

    generate(options);
}

function processFromPrompt()
{
    var schema = {
        properties: {
            database: { description: "Database name", required: true },
            username: { description: "Username", required: true },
            password: { description: "Password", required: false, hidden: true },
            targetDirectory: { description: "Target directory", required: true }
        }
    };
    
    prompt.start();
    
    prompt.get(schema, function(err, result)
    {
        result.options = null;
        generate(<generator.GenerateOptions>result);
    })
}

function generate(options:generator.GenerateOptions):void
{
    console.log("Database: " + options.database);
    console.log("Username: " + options.username);
    console.log("Password: <hidden>");
    console.log("Target  : " + options.targetDirectory);
    console.log("");

    if (!fs.existsSync(options.targetDirectory))
    {
        showHelp();
        throw Error("Target directory does not exist: " + options.targetDirectory);
    }

    generator.generate(options, function(err)
    {
        if (err)
        {
            throw err;
        }
    });
}

function showHelp():void
{
    console.log("");
    console.log("Option 1: Command line arguments");
    console.log("");
    console.log("    sequelize-auto-ts database username password targetDirectory");
    console.log("");
    console.log("            database        - The name of the local database to generate typings/definitions from");
    console.log("            username        - database user with access to read from database");
    console.log("            password        - password for user");
    console.log("            targetDirectory - The directory where generated files should be placed");
    console.log("");
    console.log("Option 2: Interactive");
    console.log("");
    console.log("    sequelize-auto-ts");
    console.log("");
    console.log("            This will launch in interactive mode where user will be prompted for all required inputs.");
    console.log("");
}

