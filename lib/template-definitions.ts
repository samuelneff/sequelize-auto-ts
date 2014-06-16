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
/// <reference path="../typings/bluebird/bluebird.d.ts" />

var Sequelize:sequelize.SequelizeStatic = require("sequelize");
var Promise = require("bluebird");

export module models
{
    export var initialized:boolean = false;

    /*__each__ tables */ export var __tableName__:__tableName__Model;

    export function initialize(database:string, username:string, password:string, options:sequelize.Options):void
    {
        var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

        /*__startEach__ tables */
        models.__tableName__ = sequelize.define("__tableName__", {
            /*__each__ fields, */ "__fieldName__":"__translatedFieldType__"
        },
            {
               timestamps: false
            });
        /*__endEach*/
    }
}

/*__ignore*/ export interface __tableName__Model {}
