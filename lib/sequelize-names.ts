////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See sequelize-auto-ts for edits
//
////////////////////////////////////////////////////////////////////

'depends typescript-client-server-compat.js';

import types = require('./sequelize-types');

export class TableNames {
    /*__each__ tables */ __tableName__:string = '__tableName__';
}
export var tableNames:TableNames = new TableNames();

/*__startEach__ tables */

export class __tableName__Fields {
    /*__each__ fields */ __fieldName__:string = '__fieldName__';
}
export var __tableNameSingularCamel__Fields:__tableName__Fields = new __tableName__Fields();

/*__endEach__*/

export class CalculatedFields {
    /*__each__ calculatedFields */ __fieldName__:string = '__fieldName__';
}
export var calculatedFields:CalculatedFields = new CalculatedFields();

export class References {
    /*__each__uniqueReferences */ __foreignKey__:types.Reference = { tableName: '__primaryTableName__', primaryKey: '__primaryKey__', foreignKey: '__foreignKey__'};
}

export var references:References = new References();
