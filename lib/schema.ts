/****************************
 *
 * Loads and exposes schema from database
 */

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./sequelize.d.ts" />

import util = require('./util');

var Sequelize:sequelize.SequelizeStatic = require("sequelize");
import fs = require('fs');

export class Schema {

    public static idSuffix:string = "id"; // NOTE: Must be LOWER case

    public references:Reference[] = [];
    public xrefs:Xref[] = [];
    public associations:Association[] = [];

    constructor(public tables:Array<Table>)
    {

    }

    public idFields():Array<Field>
    {
        var idSuffix = Schema.idSuffix;

        if (idSuffix == null || !idSuffix.length)
        {
            return [];
        }

        var idFieldsProcessed:util.Dictionary<boolean> = {};
        var idFields:Array<Field> = [];

        var idSuffixLen:number = idSuffix.length;

        for(var tableIndex:number = 0; tableIndex < this.tables.length; tableIndex++)
        {
            var table:Table = this.tables[tableIndex];

            if (table == null || table.fields == null)
            {
                continue;
            }

            for(var fieldIndex:number = 0; fieldIndex < table.fields.length; fieldIndex++)
            {
                var field:Field = table.fields[fieldIndex];
                var fieldName:string = field.fieldName;

                if (!idFieldsProcessed[fieldName] &&
                    fieldName.length > idSuffixLen &&
                    fieldName.substr(fieldName.length - idSuffixLen, idSuffixLen).toLocaleLowerCase() == idSuffix)
                {
                    idFields.push(field);
                    idFieldsProcessed[fieldName] = true;
                }
            }
        }

        return idFields;
    }

    public static fieldTypeTranslations:util.Dictionary<string> = {

        tinyint: "number",
        smallint: "number",
        int: "number",
        mediumint: "number",
        bigint: "number",
        year: "number",
        float: "number",
        double: "number",
        decimal: "number",

        timestamp: "Date",
        date: "Date",
        datetime: "Date",

        tinyblob: "Buffer",
        mediumblob: "Buffer",
        longblob: "Buffer",
        blob: "Buffer",
        binary: "Buffer",
        varbinary: "Buffer",
        bit: "Buffer",

        char: "string",
        varchar: "string",
        tinytext: "string",
        mediumtext: "string",
        longtext: "string",
        text: "string",
        "enum": "string",
        "set": "string",
        time: "string",
        geometry: "string"
    };

    public static fieldTypeSequelize:util.Dictionary<string> = {

        tinyint: 'Sequelize.INTEGER',
        smallint: 'Sequelize.INTEGER',
        int: 'Sequelize.INTEGER',
        mediumint: 'Sequelize.INTEGER',
        bigint: 'Sequelize.INTEGER',
        year: 'Sequelize.INTEGER',
        
        float: 'Sequelize.DECIMAL',
        double: 'Sequelize.DECIMAL',
        decimal: 'Sequelize.DECIMAL',

        timestamp: 'Sequelize.DATE',
        date: 'Sequelize.DATE',
        datetime: 'Sequelize.DATE',

        tinyblob: 'Sequelize.BLOB',
        mediumblob: 'Sequelize.BLOB',
        longblob: 'Sequelize.BLOB',
        blob: 'Sequelize.BLOB',
        binary: 'Sequelize.BLOB',
        varbinary: 'Sequelize.BLOB',
        bit: 'Sequelize.BLOB',

        char: 'Sequelize.STRING',
        varchar: 'Sequelize.STRING',
        tinytext: 'Sequelize.STRING',
        mediumtext: 'Sequelize.STRING',
        longtext: 'Sequelize.STRING',
        text: 'Sequelize.STRING',
        "enum": 'Sequelize.STRING',
        "set": 'Sequelize.STRING',
        time: 'Sequelize.STRING',
        geometry: 'Sequelize.STRING'
    };
}

export class Table
{
    fields:Array<Field> = [];

    constructor(public tableName:string)
    {

    }

    public tableNameSingular():string
    {
        return Sequelize.Utils.singularize(this.tableName, "en");
    }

    public tableNameSingularCamel():string
    {
        var tableName:string = this.tableNameSingular();
        return tableName.charAt(0).toLowerCase() + tableName.substr(1);
    }

    public nonReferenceFields():Field[] {
        return this.fields.filter(f => !f.isReference);
    }
}

export class Field
{
    constructor(public fieldName:string, public fieldType:string, public table:Table, public isReference:boolean = false)
    {

    }

    fieldNameProperCase():string
    {
        return this.fieldName.charAt(0).toUpperCase() + this.fieldName.substr(1, this.fieldName.length - 1);
    }

    translatedFieldType():string
    {
        var translated:string = Schema.fieldTypeTranslations[this.fieldType];
        if (translated == undefined) {
            console.log('Unable to translate field type:' + this.fieldType);
            translated = this.fieldType;
        }
        return translated;
    }

    sequelizeFieldType():string
    {
        var translated:string = Schema.fieldTypeSequelize[this.fieldType];
        if (translated == undefined) {
            console.log('Unable to sequelize field type:' + this.fieldType);
            translated = this.fieldType;
        }
        return translated;
    }

    isIdField():boolean {
        return Schema.idSuffix != null &&
            Schema.idSuffix.length &&
            this.fieldName.length > Schema.idSuffix.length &&
            this.fieldName.substr(this.fieldName.length - Schema.idSuffix.length, Schema.idSuffix.length).toLowerCase() == Schema.idSuffix;
    }

    customFieldType():string
    {
        return this.isIdField()
            ? this.fieldNameProperCase()
            : this.isReference
                ? this.fieldType
                : this.translatedFieldType();
    }

    defineFieldType():string {
        if ( this == this.table.fields[0]) {
            return '{type: "number", primaryKey: true, autoIncrement: true}';
        } else if (this.table.tableName.substr(0,4) == 'Xref' && this == this.table.fields[1]) {
            return '{type: "number", primaryKey: true}';
        }
        return this.sequelizeFieldType();
    }

    public tableNameSingular():string
    {
        return this.table.tableNameSingular();
    }

    public tableNameSingularCamel():string
    {
        return this.table.tableNameSingularCamel();
    }
}

export class Reference {

    constructor(public primaryTableName:string,
                public foreignTableName:string,
                public associationName:string,
                public foreignKey:string) {

    }

    associationNameQuoted():string {
        return this.associationName
            ? '\'' + this.associationName + '\''
            : undefined;
    }
}

export class Xref {

    constructor(public firstTableName:string,
                public firstFieldName:string,
                public secondTableName:string,
                public secondFieldName:string,
                public xrefTableName:string) {

    }
}

// Associations are named foreign keys, like OwnerUserID
export class Association {
    constructor(public associationName:string) {}
}

interface ColumnDefinitionRow
{
    table_name:string;
    column_name:string;
    data_type:string;
}

interface ReferenceDefinitionRow
{
    table_name:string;
    column_name:string;
    referenced_table_name:string;
    referenced_column_name:string;
}

export function read(database:string, username:string, password:string, options:sequelize.Options, callback:(err:Error, schema:Schema) => void):void
{
    var schema:Schema;
    var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

    var sql:string =
        "select table_name, column_name, data_type " +
        "from information_schema.columns " +
        "where table_schema = '" + database + "' " +
        "order by table_name, ordinal_position";

    sequelize
        .query(sql)
        .complete(processTablesAndColumns);

    function processTablesAndColumns(err:Error, rows:Array<ColumnDefinitionRow>):void
    {
        if (err)
        {
            callback(err, null);
            return;
        }

        if (rows == null)
        {
            var err:Error = new Error("No schema info returned for database.");
            callback(err, null);
            return;
        }

        if (rows.length == 0)
        {
            var err:Error = new Error("Empty schema info returned for database.");
            callback(err, null);
            return;
        }

        var tables:Array<Table> = [];
        var table:Table = new Table("");

        for(var index:number = 0; index<rows.length; index++)
        {
            var row:ColumnDefinitionRow = rows[index];

            if (row.table_name != table.tableName)
            {
                table = new Table(row.table_name);
                tables.push(table);
            }

            table.fields.push(new Field(row.column_name, row.data_type, table));
        }

        schema = new Schema(tables);
        //callback(null, schema);
        readReferences();
    }

    function readReferences():void {

        var sql:string =
            "SELECT	table_name, column_name, referenced_table_name, referenced_column_name " +
            "FROM 	information_schema.key_column_usage " +
            "WHERE	constraint_schema = '" + database + "' " +
            "AND	referenced_table_name IS NOT NULL;";

        sequelize
            .query(sql)
            .complete(processReferences);
    }

    function processReferences(err:Error, rows:Array<ReferenceDefinitionRow>):void
    {
        if (err)
        {
            callback(err, null);
            return;
        }

        if (rows == null || rows.length == 0)
        {
            console.log("Warning: No references defined in database.");
            callback(null, schema);
            return;
        }

        var tableLookup:util.Dictionary<Table> = {};
        var xrefs:util.Dictionary<Xref> = {};
        var associationsFound:util.Dictionary<boolean> = {};

        schema.tables.forEach(table => tableLookup[table.tableName] = table);

        rows.forEach(processReferenceRow);

        processReferenceXrefs();

        callback(null, schema);

        function processReferenceRow(row:ReferenceDefinitionRow):void {
            if (row.table_name.length > 4 && row.table_name.substr(0, 4) == 'Xref')
            {
                processReferenceXrefRow(row);
                return;
            }

            // Example rows for
            //
            // CREATE TABLE Leads (
            //    leadId integer PRIMARY KEY AUTO_INCREMENT,
            //    accountId integer NOT NULL,
            //
            //    FOREIGN KEY (accountId) REFERENCES Accounts (accountId),
            //  );
            //
            // table_name               =   Leads
            // column_name              =   accountId
            // referenced_table_name    =   Accounts
            // referenced_column_name   =   accountId
            //
            var parentTable = tableLookup[row.referenced_table_name];
            var childTable = tableLookup[row.table_name];

            // create array of children in parent, i.e., AccountPojo.leads:LeadPojo[]
            parentTable.fields.push(new Field(
                util.camelCase(row.table_name),                                     // Leads -> leads
                Sequelize.Utils.singularize(row.table_name) + 'Pojo[]',             // Leads -> LeadPojo[]
                parentTable,                                                        // Accounts table reference
                true));

            // create singular parent reference from child
            childTable.fields.push(new Field(
                util.camelCase(Sequelize.Utils.singularize(row.referenced_table_name)),    // Accounts -> account
                Sequelize.Utils.singularize(row.referenced_table_name) + 'Pojo',           // Accounts -> AccountPojo
                childTable,
                true));

            var associationName:string;

            if (row.column_name == row.referenced_column_name) {
                associationName = undefined;
            } else {

                // example, row.column_name is ownerUserID
                // we want association to be called OwnerUsers
                // so we take first character and make it uppercase,
                // then take rest of prefix from foreign key
                // then append the referenced table name
                associationName = row.column_name.charAt(0).toUpperCase() +
                                  row.column_name.substr(1, row.column_name.length - row.referenced_column_name.length - 1) +
                                  row.referenced_table_name;

                if (!associationsFound[associationName]) {
                    schema.associations.push(new Association(associationName));
                    associationsFound[associationName] = true;
                }
            }

            // tell Sequelize about the reference
            schema.references.push(new Reference(
                                            row.referenced_table_name,
                                            row.table_name,
                                            associationName,
                                            row.column_name));
        }

        function processReferenceXrefRow(row:ReferenceDefinitionRow):void {
            var xref:Xref = xrefs[row.table_name];

            if (xref == null) {
                xrefs[row.table_name] = new Xref(
                                                    row.referenced_table_name,
                                                    row.referenced_column_name,
                                                    null,
                                                    null,
                                                    row.table_name);
            } else {
                xref.secondTableName = row.referenced_table_name;
                xref.secondFieldName = row.referenced_column_name;
            }
        }

        function processReferenceXrefs():void {
            for (var xrefName in xrefs) {

                if (!xrefs.hasOwnProperty(xrefName)) {
                    continue;
                }

                var xref:Xref = xrefs[xrefName];

                schema.xrefs.push(xref);

                var firstTable:Table = tableLookup[xref.firstTableName];
                var secondTable:Table = tableLookup[xref.secondTableName];

                firstTable.fields.push(new Field(
                    util.camelCase(xref.secondTableName),
                    Sequelize.Utils.singularize(xref.secondTableName) + 'Pojo[]',
                    firstTable,
                    true));

                secondTable.fields.push(new Field(
                    util.camelCase(xref.firstTableName),
                        Sequelize.Utils.singularize(xref.firstTableName) + 'Pojo[]',
                    secondTable,
                    true));

            }
        }
    }
}

