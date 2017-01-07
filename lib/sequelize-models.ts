////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See sequelize-auto-ts for edits
//
////////////////////////////////////////////////////////////////////

/// <reference path='../typings/node/node.d.ts' />
/// <reference path='./sequelize.d.ts' />

import types = require('./sequelize-types');

var Sequelize:sequelize.SequelizeStatic = require('sequelize');

export var initialized:boolean = false;
export var SEQUELIZE:sequelize.Sequelize;

/*__each__ tables */ export var __tableName__:types.__tableName__Model;

/*__ignore__*/ var __defineFieldType__;
/*__ignore__*/ var __primaryTableName__:sequelize.Model<any, any>;
/*__ignore__*/ var __foreignTableName__:sequelize.Model<any, any>;
/*__ignore__*/ var __firstTableName__:sequelize.Model<any, any>;
/*__ignore__*/ var __secondTableName__:sequelize.Model<any, any>;
/*__ignore__*/ var __associationNameQuoted__:string;

export function initialize(database:string, username:string, password:string, options:sequelize.SequelizeOptions):any
{
    if (initialized)
    {
        return;
    }

    SEQUELIZE = new Sequelize(database, username, password, options);

    /*__startEach__ tables */

    __tableName__ = <types.__tableName__Model> SEQUELIZE.define<types.__tableNameSingular__Instance, types.__tableNameSingular__Pojo>('__tableNameSingular__', {
        /*__each__ realDbFields, */'__fieldName__':__defineFieldType__
        },
        {
            timestamps: false,
            classMethods: {
                get__tableNameSingular__:(__tableNameSingularCamel__:any) => {
                    var where:{[key:string]:any} = {};
                    var id:number = parseInt(__tableNameSingularCamel__);
                    if (isNaN(id)) {
                        /*__each__ realDbFields */ if (__tableNameSingularCamel__['__fieldName__'] !== undefined) { where['__fieldName__'] = __tableNameSingularCamel__['__fieldName__']}
                    } else {
                        where['__idFieldName__'] = id;
                    }
                    return __tableName__.find({where: where});
                }
            }
        });
    /*__endEach__*/

    /*__startEach__ references */

    __primaryTableName__.hasMany(__foreignTableName__, {foreignKey: '__foreignKey__' });
    __foreignTableName__.belongsTo(__primaryTableName__, {as: __associationNameQuoted__, foreignKey: '__foreignKey__' });

    /*__endEach__*/

    /*__startEach__ xrefs */

    __firstTableName__.belongsToMany(__secondTableName__, { through: '__xrefTableName__'});
    __secondTableName__.belongsToMany(__firstTableName__, { through: '__xrefTableName__'});

    /*__endEach__*/

    return exports;
}

