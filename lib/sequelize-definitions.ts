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

var Sequelize:sequelize.SequelizeStatic = require("sequelize");

export module models
{
    export var initialized:boolean = false;

    /*__each__ tables */ export var __tableName__:__tableName__Model;

    export function initialize(database:string, username:string, password:string, options:sequelize.Options):void
    {
        if (initialized)
        {
            return;
        }

        var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

        /*__startEach__ tables */

        models.__tableName__ = sequelize.define<__tableNameSingular__Instance, __tableNameSingular__Pojo>("__tableNameSingular__", {
            /*__each__ fields, */"__fieldName__":"__translatedFieldType__"
            },
            {
               timestamps: false
            });
        /*__endEach__*/
    }
}

/*__ignore__*/ export interface __tableName__Model {}
