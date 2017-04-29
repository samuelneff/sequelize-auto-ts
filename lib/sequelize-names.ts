////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See sequelize-auto-ts for edits
//
////////////////////////////////////////////////////////////////////

import types = require('./sequelize-types');

export const fieldsByTable:{[tableName:string]:{[fieldName:string]:string}} = {};

export interface SequelizeNames {
    TableNames: TableNames;
    calculatedFields:CalculatedFields;
    references:References;
    /*__each__ tables */ __tableNameSingularCamel__Fields:__tableName__Fields;
}

export class TableNames {
    /*__each__ tables */ __tableNameModel__:string = '__tableName__';
}
export const tableNames:TableNames = new TableNames();

/*__startEach__ tables */

export class __tableName__Fields {
    /*__each__ fields */ __fieldName__:string = '__fieldName__';
}
export const __tableNameSingularCamel__Fields:__tableName__Fields = new __tableName__Fields();
fieldsByTable['__tableNameSingularCamel__'] = <any>__tableNameSingularCamel__Fields;
fieldsByTable['__tableNameCamel__'] = <any>__tableNameSingularCamel__Fields;
fieldsByTable['__tableName__'] = <any>__tableNameSingularCamel__Fields;

/*__endEach__*/

export class CalculatedFields {
    /*__each__ calculatedFields */ __fieldName__:string = '__fieldName__';
}
export const calculatedFields:CalculatedFields = new CalculatedFields();

/*__ignore__*/ let __associationNameQuoted__:string;
export class References {
    /*__each__ uniqueReferences */ __foreignKey__:types.Reference = { tableName: '__primaryTableName__', primaryKey: '__primaryKey__', foreignKey: '__foreignKey__', as: __associationNameQuoted__};
}

export const references:References = new References();

export class FieldTypes {
    /*__each__ uniqueRealFields */ __fieldName__:string = '__translatedFieldType__';
}
export const fieldTypes:FieldTypes = new FieldTypes();

