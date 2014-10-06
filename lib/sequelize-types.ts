////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See sequelize-auto-ts for edits
//
////////////////////////////////////////////////////////////////////

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./sequelize.d.ts" />

import types = require('./sequelize-types');

/*__each__ idFields */ export interface __fieldNameProperCase__ { __fieldNameProperCase__:number; }

/*__ignore__*/ export interface __translatedFieldType__ {}
/*__ignore__*/ export interface __customFieldType__ {}
/*__ignore__*/ export interface __tableNameSingular__Instance {}
/*__ignore__*/ export interface __tableNameSingular__Pojo {}
/*__ignore__*/ export interface __idFieldNameTitleCase__ {}

/*__startEach__ tables */
export interface __tableNameSingular__Pojo
{
    /*__each__ fields */ __fieldName__?:__customFieldType__;
}

export interface __tableNameSingular__Instance extends sequelize.Instance<__tableNameSingular__Instance, __tableNameSingular__Pojo>, __tableNameSingular__Pojo { }

export interface __tableName__Model extends sequelize.Model<__tableNameSingular__Instance, __tableNameSingular__Pojo> {
    get__tableNameSingular__(__idFieldName__:__idFieldNameTitleCase__):sequelize.PromiseT<__tableNameSingular__Instance>;
    get__tableNameSingular__(__tableNameSingularCamel__:__tableNameSingular__Pojo):sequelize.PromiseT<__tableNameSingular__Instance>;
}

/*__endEach__*/

export interface Reference {
    tableName:string;
    primaryKey:string;
    foreignKey:string;
    as:string;
}
