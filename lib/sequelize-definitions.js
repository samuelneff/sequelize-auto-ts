////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See template-definitions.ts for edits
//
////////////////////////////////////////////////////////////////////
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/sequelize/sequelize.d.ts" />
/// <reference path="./sequelize-types.ts" />
var Sequelize = require("sequelize");

(function (models) {
    models.initialized = false;

    /*__each__ tables */ models.__tableName__;

    function initialize(database, username, password, options) {
        if (models.initialized) {
            return;
        }

        var sequelize = new Sequelize(database, username, password, options);

        /*__startEach__ tables */
        models.__tableName__ = sequelize.define("__tableNameSingular__", {
            /*__each__ fields, */ "__fieldName__": "__translatedFieldType__"
        }, {
            timestamps: false
        });
        /*__endEach__*/
    }
    models.initialize = initialize;
})(exports.models || (exports.models = {}));
var models = exports.models;

//# sourceMappingURL=sequelize-definitions.js.map
