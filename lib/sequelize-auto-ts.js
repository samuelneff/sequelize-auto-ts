/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./sequelize.d.ts" />
var schema = require("./schema");
var path = require("path");
var ScriptTemplate = require("../node_modules/script-template/lib/index");
var fs = require("fs");

var Sequelize = require("sequelize");

var _ = Sequelize.Utils._;

var targetProjectRootDirectory = null;

function generate(options, callback) {
    if (callback == undefined) {
        callback = function (err) {
        };
    }

    schema.read(options.database, options.username, options.password, options.options, function (err, schema) {
        if (err) {
            callback(err);
            return;
        }

        generateTypes(options, schema, callback);
    });
}
exports.generate = generate;

function generateTypes(options, schema, callback) {
    generateFromTemplate(options, schema, "sequelize-types.ts", function (err) {
        generateFromTemplate(options, schema, "sequelize-names.ts", function (err) {
            generateFromTemplate(options, schema, "sequelize-models.ts", callback);
        });
    });
}

function generateFromTemplate(options, schema, templateName, callback) {
    console.log("Generating " + templateName);

    var templateText = fs.readFileSync(path.join(__dirname, templateName), "utf8");

    var engine = new ScriptTemplate(templateText);
    var genText = engine.run(schema);

    genText = translateReferences(genText, options);

    fs.writeFileSync(path.join(options.targetDirectory, templateName), genText);

    callback(null);
}

function translateReferences(source, options) {
    var re = new RegExp("///\\s+<reference\\s+path=[\"'][\\./\\w\\-\\d]+?([\\w\\.\\-]+)[\"']\\s*/>", "g");

    function replaceFileName(match, fileName) {
        if (targetProjectRootDirectory == null) {
            targetProjectRootDirectory = findTargetProjectRootDirectory(options);
        }

        var targetPath = findTargetPath(fileName, targetProjectRootDirectory);

        var relativePath = targetPath == null ? null : path.relative(options.targetDirectory, targetPath);

        if (relativePath == null) {
            var sourceText = fs.readFileSync(path.join(__dirname, fileName), "utf8");
            var targetText = translateReferences(sourceText, options);
            fs.writeFileSync(path.join(options.targetDirectory, fileName), targetText);

            relativePath = "./" + fileName;
        } else if (relativePath.charAt(0) != ".") {
            relativePath = "./" + relativePath;
        }
        return "/// <reference path=\"" + relativePath.replace(/\\/g, '/') + "\" />";
    }

    return source.replace(re, replaceFileName);
}

function findTargetProjectRootDirectory(options) {
    var dir = options.targetDirectory;

    while (!hasFile(dir, "package.json")) {
        var parent = path.resolve(dir, "..");
        if (parent == null || parent == dir) {
            // found root without finding a package.json file
            return options.targetDirectory;
        }
        dir = parent;
    }

    return dir;
}

function hasFile(directory, file) {
    var files = fs.readdirSync(directory);
    return _.contains(files, file);
}

function findTargetPath(fileName, searchDirectory) {
    var target = path.join(searchDirectory, fileName);
    if (fs.existsSync(target)) {
        return target;
    }

    var childDirectories = fs.readdirSync(searchDirectory);
    for (var i = 0; i < childDirectories.length; i++) {
        var childName = childDirectories[i];
        var childPath = path.join(searchDirectory, childName);

        var stat = fs.statSync(childPath);

        if (stat.isDirectory() && childName.charAt(0) != '.' && childName != 'node_modules') {
            target = findTargetPath(fileName, childPath);
            if (target != null) {
                return target;
            }
        }
    }
    return null;
}
//# sourceMappingURL=sequelize-auto-ts.js.map
