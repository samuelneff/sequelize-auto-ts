////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See template-definitions.ts for edits
//
////////////////////////////////////////////////////////////////////

/// <reference path='../typings/node/node.d.ts' />
/// <reference path='./sequelize.d.ts' />

import types = require('./sequelize-types');

var Sequelize:sequelize.SequelizeStatic = require('sequelize');

export var initialized:boolean = false;

/*__each__ tables */ export var __tableName__:types.__tableName__Model;

export function initialize(database:string, username:string, password:string, options:sequelize.Options):void
{
    if (initialized)
    {
        return;
    }

    var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

    /*__startEach__ tables */

    __tableName__ = <types.__tableName__Model> sequelize.define<types.__tableNameSingular__Instance, types.__tableNameSingular__Pojo>('__tableNameSingular__', {
        /*__each__ nonReferenceFields, */'__fieldName__':'__translatedFieldType__'
        },
        {
            timestamps: false,
            classMethods: {
                get__tableNameSingular__:(__tableNameSingularCamel__:types.__tableNameSingular__Pojo) => {
                    var where:{[key:string]:any} = {};
                    /*__each__ nonReferenceFields */ if (__tableNameSingularCamel__['__fieldName__'] !== undefined) { where['__fieldName__'] = __tableNameSingularCamel__['__fieldName__']}
                    return this.find({where: where});
                }
            }
        });
    /*__endEach__*/
}
