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

import types = require('./sequelize-types'); // important so we can use same fully qualified names in all generated files

/*__each__ idFields */ export interface __fieldNameProperCase__ { __fieldNameProperCase__:number; }

/*__ignore__*/ export interface __translatedFieldType__ {}
/*__ignore__*/ export interface __customFieldType__ {}
/*__ignore__*/ export interface __tableNameSingular__Instance {}
/*__ignore__*/ export interface __tableNameSingular__Pojo {}
/*__ignore__*/ export interface __idFieldNameTitleCase__ {}

var asserters:{[typeName:string]:(pojo:any, allowUndefined?:boolean) => void} = {};

/*__startEach__ tables */

//////////////////////////////////////////////////////////////////////////////
//
//
//               __tableName__
//
//
//////////////////////////////////////////////////////////////////////////////


export interface __tableNameSingular__Pojo
{
    /*__each__ fields */ __fieldName__?:__customFieldType__;
}

export interface __tableNameSingular__Instance extends sequelize.Instance<__tableNameSingular__Instance, __tableNameSingular__Pojo>, __tableNameSingular__Pojo { }

export interface __tableName__Model extends sequelize.Model<__tableNameSingular__Instance, __tableNameSingular__Pojo> {
    get__tableNameSingular__(__idFieldName__:__idFieldNameTitleCase__):sequelize.PromiseT<__tableNameSingular__Instance>;
    get__tableNameSingular__(__tableNameSingularCamel__:__tableNameSingular__Pojo):sequelize.PromiseT<__tableNameSingular__Instance>;
}

export function assertValid__tableNameSingular__(pojo:__tableNameSingular__Pojo, allowUndefined?:boolean):void {

    if (pojo === undefined || pojo === null) {
        if (allowUndefined) {
            return;
        }
        throw new Error('Invalid __tableNameSingular__ provided. It is \'' + (typeof pojo) + '\'.');
    }
    var fieldNames:string[] = Object.keys(pojo);
    if (fieldNames.length === 0) {
        throw new Error('Invalid __tableNameSingular__ provided. It is an empty object.');
    }

    var i:number = fieldNames.length;
    while(i-- > 0) {
        switch(fieldNames[i]) {
            /*__each__ fields */ case '__fieldName__': assertValidFieldType('__tableNameSingular__', '__fieldName__', pojo, '__translatedFieldType__'); break;
            default:
                throw new Error('Invalid __tableNameSingular__ provided. Field \'' + fieldNames[i] + '\' is not supported.')
        }
    }
}
asserters['__tableNameSingular__'] = assertValid__tableNameSingular__;




/*__endEach__*/

var BOOLEAN_TYPE:string = typeof(true);
var NUMBER_TYPE:string = typeof(1);
var STRING_TYPE:string = typeof('');
var FUNCTION_TYPE:string = typeof(function() {});
var DATE_EXPECTED_TYPE:string = 'Date';
var BUFFER_EXPECTED_TYPE:string = 'Buffer';
var BUFFER_EXISTS:boolean = typeof Buffer !== 'undefined'; //in node exists, in js not, so only validate in node

function assertValidFieldType(pojoName:string, fieldName:string, pojo:any, expectedType:string):boolean {

    var value:any = pojo[fieldName];
    var actualType:string = typeof value;

    if (value === undefined || value === null) {
        pojo[value] = undefined;
        return;
    }

    switch(expectedType) {
        case BOOLEAN_TYPE:
            if (actualType !== BOOLEAN_TYPE && actualType !== NUMBER_TYPE) {
                err();
            }
            pojo[value] = Boolean(value);
            return;

        case NUMBER_TYPE:
            if (actualType === NUMBER_TYPE) {
                return;
            }
            if (actualType === STRING_TYPE) {
                var newValue:number = parseFloat(value);
                if (isNaN(newValue)) {
                    err();
                }
                pojo[fieldName] = newValue;
            }
            return;

        case STRING_TYPE:
            if (actualType !== STRING_TYPE) {
                pojo[fieldName] = value.toString();
            }
            return;

        case DATE_EXPECTED_TYPE:
            var getTime:Function = value.getTime;
            if (typeof getTime === FUNCTION_TYPE) {
                var timeValue:number = value.getTime();
                if (isNaN(timeValue)){
                    err();
                }
                if (!(value instanceof Date)) {
                    pojo[fieldName] = new Date(timeValue);
                }
                return;
            }

            if (actualType === STRING_TYPE) {
                var newDate:Date = new Date(value);
                if (!isNaN(newDate.getTime())) {
                    pojo[fieldName] = newDate;
                    return;
                }
            }
            err();
            return;

        case BUFFER_EXPECTED_TYPE:
            if (!BUFFER_EXISTS) {
                return;
            }

            if (!(value instanceof Buffer)) {
                err();
            }
            return;
    }

    // one pojo of array of array of pojos?
    if (expectedType.length > 3 && expectedType.substr(expectedType.length - 3, 2) === '[]') {
        var individualPojoType:string = expectedType.substr(0, expectedType.length - 6);

        var asserter:Function = this['assertValid' + individualPojoType];
        if (typeof asserter !== FUNCTION_TYPE) {
            err();
        }

        if (isNaN(value.length)) {
            err();
        }
        for(var i:number = 0; i<value.length; i++) {
            try {
                asserter(value[i], true);
            } catch(e) {
                err('Error at index \'' + i + '\': ' + e.message);
            }
        }

        // all instances valid
        return;
    }

    var asserter:Function = asserters[expectedType.substr(0, expectedType.length - 4)];
    if (typeof asserter !== FUNCTION_TYPE) {
        expectedTypeErr();
    }

    try {
        asserter(value, true);
    } catch(e) {
        err(e.message);
    }

    function err(extraMessage?:string):void {
        var message:string = 'Invalid ' + pojoName + ' provided. Field \'' + fieldName + '\' with value \'' + safeValue(value) + '\' is not a valid \'' + expectedType + '\'.';
        if (extraMessage !== undefined) {
            message += ' ' + extraMessage;
        }
        throw new Error(message);
    }

    function expectedTypeErr():void {
        throw new Error('Cannot validate \'' + pojoName + '\' field \'' + fieldName + '\' since expected type provided \'' + expectedType + '\' is not understood.');
    }
}

function safeValue(value:any):string {

    if (value === undefined || value === null) {
        return typeof value;
    }

    var s:string = value.toString();
    return s.substr(0, 100);
}

export interface Reference {
    tableName:string;
    primaryKey:string;
    foreignKey:string;
    as:string;
}
