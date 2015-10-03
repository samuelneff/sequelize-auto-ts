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

/*__ignore__*/ var __defineFieldType__;
/*__ignore__*/ var __associationNameQuoted__:string;

export class Models {

    public SEQUELIZE:sequelize.Sequelize;

    /*__each__ tables */ public __tableNameCamel__:types.__tableName__Model;

    /*__ignore__*/ __primaryTableNameCamel__:sequelize.Model<any, any>;
    /*__ignore__*/ __foreignTableNameCamel__:sequelize.Model<any, any>;
    /*__ignore__*/ __firstTableNameCamel__:sequelize.Model<any, any>;
    /*__ignore__*/ __secondTableNameCamel__:sequelize.Model<any, any>;

    constructor(database:string, username:string, password:string, options:sequelize.Options) {

        this.SEQUELIZE = new Sequelize(database, username, password, options);
        var self:Models = this;

        /*__startEach__ tables */

        this.__tableNameCamel__ = <types.__tableName__Model> this.SEQUELIZE.define<types.__tableNameSingular__Instance, types.__tableNameSingular__Pojo>('__tableNameSingular__', {
                /*__each__ realDbFields, */'__fieldName__': __defineFieldType__
            },
            {
                timestamps: false,
                classMethods: {
                    get__tableNameSingular__: (__tableNameSingularCamel__:any) => {
                        var where:{[key:string]:any} = {};
                        var id:number = parseInt(__tableNameSingularCamel__);
                        if (isNaN(id)) {
                            /*__each__ realDbFields */ if (__tableNameSingularCamel__['__fieldName__'] !== undefined) { where['__fieldName__'] = __tableNameSingularCamel__['__fieldName__']}
                        } else {
                            where['__idFieldName__'] = id;
                        }
                        return self.__tableNameCamel__.find({where: where});
                    }
                }
            });
        /*__endEach__*/

        /*__startEach__ references */

        this.__primaryTableNameCamel__.hasMany(this.__foreignTableNameCamel__, {foreignKey: '__foreignKey__'});
        this.__foreignTableNameCamel__.belongsTo(this.__primaryTableNameCamel__, {
            as: __associationNameQuoted__,
            foreignKey: '__foreignKey__'
        });

        /*__endEach__*/

        /*__startEach__ xrefs */

        this.__firstTableNameCamel__.hasMany(this.__secondTableNameCamel__, {through: '__xrefTableName__'});
        this.__secondTableNameCamel__.hasMany(this.__firstTableNameCamel__, {through: '__xrefTableName__'});

        /*__endEach__*/
    }

}

interface ModelCache {
    models:Models;
    lastRetrieved:Date;
}

var modelsCache:{[key:string]: ModelCache} = {};

export function forDatabase(database:string, username?:string, password?:string, options?:sequelize.Options):Models {

    var cache:ModelCache = modelsCache[database];
    if (cache !== undefined) {
        cache.lastRetrieved = new Date();
        return cache.models;
    }

    if (typeof username !== 'string' || username.length === 0 ||
        typeof password !== 'string' || password.length === 0) {

        throw new Error('Cannot get models for database "' + database + '" since username and/or password were not ' +
            'provided and the database is not yet cached. forDatabase() must be called first with authentication ' +
            'data before it can be called with only the database name.');
    }

    cache = {
        models: new Models(database, username, password, options),
        lastRetrieved: new Date()
    };

    modelsCache[database] = cache;

    return cache.models;
}

export function clearAll():void {
    modelsCache = {};
}

export function clearDatabase(database:string):void {
    delete modelsCache[database];
}

export function clearNotUsedSince(date:Date):void {
    var time:number = date.getTime();

    var allKeys:string[] = Object.keys(modelsCache);
    var clearKeys:string[] = allKeys.filter(key => modelsCache[key].lastRetrieved.getTime() < time);

    if (clearKeys.length === 0) {
        return;
    }

    if (clearKeys.length === allKeys.length) {
        clearAll();
        return;
    }

    clearKeys.forEach(key => clearDatabase(key));
}
