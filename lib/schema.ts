/****************************
 *
 * Loads and exposes schema from database
 */

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./sequelize.d.ts" />

import util = require('./util');

var Sequelize:sequelize.SequelizeStatic = require("sequelize");
import fs = require('fs');
var _:sequelize.Lodash = Sequelize.Utils._;

export class Schema {

    public static idSuffix:string = "id"; // NOTE: Must be LOWER case

    public references:Reference[] = [];
    public xrefs:Xref[] = [];
    public associations:Association[] = [];
    public calculatedFields:Array<Field> = [];
    public views:Table[] = [];

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
        integer: "number",
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
        integer: 'Sequelize.INTEGER',
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

    public uniqueReferences():Reference[] {
        var u:Reference[] = [];

        var foundIds:_.Dictionary<boolean> = {};

        this.references.forEach(addReferenceIfUnique);

        this.tables.forEach(addTablePrimaryKeys);

        return u;

        function addReferenceIfUnique(reference:Reference, index:number, array:Reference[]):void {
            if (reference.isView || foundIds[reference.foreignKey]) {
                return;
            }

            u.push(reference);

            foundIds[reference.foreignKey] = true;
        }

        function addTablePrimaryKeys(table:Table, index:number, array:Table[]):void {
            if (table.isView || table.tableName.substr(0,4) === 'Xref') {
                return;
            }
            var pk:Field = table.fields[0];

            if (foundIds[pk.fieldName]) {
                return;
            }
            foundIds[pk.fieldName] = true;

            var r:Reference = new Reference(table.tableName,
                                            table.tableName,
                                            undefined,
                                            pk.fieldName,
                                            pk.fieldName,
                                            false);
            u.push(r);
        }
    }
}

export class Table
{
    fields:Array<Field> = [];
    isView:boolean = false;

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

    public realDbFields():Field[] {
        return this.fields.filter(f => !f.isReference && !f.isCalculated);
    }
    idField():Field {
        return _.find(this.fields, f => f.isIdField());
    }

    idFieldName():string {
        var idField:Field = this.idField();
        if (idField === undefined) {
            console.log('Unable to find ID field for type: ' + this.tableName);
            return '!!cannotFindIdFieldOn' + this.tableName + '!!';
        }
        return idField.fieldName;
    }

    idFieldNameTitleCase():string {
        var idField:Field = this.idField();
        if (idField === undefined) {
            console.log('Unable to find ID field for type: ' + this.tableName);
            return '!!cannotFindIdFieldOn' + this.tableName + '!!';
        }
        return idField.fieldNameProperCase();
    }
}

export class Field
{
    constructor(public fieldName:string, public fieldType:string, public table:Table, public isReference:boolean = false, public isCalculated:boolean = false)
    {

    }

    fieldNameProperCase():string
    {
        return toTitleCase(this.fieldName);
    }

    translatedFieldType():string
    {
        var translated:string = Schema.fieldTypeTranslations[this.fieldType];
        if (translated == undefined) {
            if (this.fieldType.length < 6 || this.fieldType.substr(0, 6) !== 'types.')
            {
                console.log('Unable to translate field type:' + this.fieldType);
            }
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
            return '{type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}';
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
                public primaryKey:string,
                public foreignKey:string,
                public isView:boolean) {

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
    ordinal_position:number;
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
    var tableLookup:util.Dictionary<Table> = {};
    var xrefs:util.Dictionary<Xref> = {};
    var associationsFound:util.Dictionary<boolean> = {};

    var sql:string =
        "select table_name, column_name, data_type, ordinal_position " +
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

        readCustomFields(rows);
    }

    function readCustomFields(originalRows:ColumnDefinitionRow[]):void {

        if (!_.any(originalRows, r => r.table_name == 'SequelizeCustomFieldDefinitions')) {
            processTablesAndColumnsWithCustom(originalRows, {});
            return;
        }

        var sql:string =
            "select table_name, column_name, data_type, ordinal_position " +
            "from SequelizeCustomFieldDefinitions " +
            "order by table_name, ordinal_position";

        sequelize
            .query(sql)
            .complete(processCustomFields);

        function processCustomFields(err:Error, customFields:ColumnDefinitionRow[]):void {

            if (err) {
                callback(err, null);
                return;
            }

            var customFieldLookup:util.Dictionary<ColumnDefinitionRow> =
                    util.arrayToDictionary(customFields,'column_name');

            var combined:ColumnDefinitionRow[] = originalRows.concat(customFields);
            combined.sort(sortByTableNameThenOrdinalPosition);

            processTablesAndColumnsWithCustom(combined, customFieldLookup);
        }

    }

    function sortByTableNameThenOrdinalPosition(row1:ColumnDefinitionRow, row2:ColumnDefinitionRow):number {
        return row1.table_name < row2.table_name
                        ? -1
                            : (row1.table_name > row2.table_name
                                ? 1
                                : ( row1.ordinal_position < row2.ordinal_position
                                    ? -1
                                    : ( row1.ordinal_position > row2.ordinal_position
                                        ? 1
                                        : 0)));
    }

    function processTablesAndColumnsWithCustom(rows:ColumnDefinitionRow[], customFieldLookup:util.Dictionary<ColumnDefinitionRow>):void {

        var tables:Array<Table> = [];
        var table:Table = new Table("");

        schema = new Schema(tables);

        for(var index:number = 0; index<rows.length; index++)
        {
            var row:ColumnDefinitionRow = rows[index];

            if (row.table_name != table.tableName)
            {
                table = new Table(row.table_name);
                tables.push(table);
            }

            var isCalculated:boolean = customFieldLookup[row.column_name] !== undefined;

            var field:Field = new Field(row.column_name, row.data_type, table, false, isCalculated);;
            table.fields.push(field);

            if (isCalculated) {
                schema.calculatedFields.push(field);
            }
        }

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

        schema.tables.forEach(table => tableLookup[table.tableName] = table);

        rows.forEach(processReferenceRow);

        processReferenceXrefs();

        fixViewNames();

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
                                            util.camelCase(Sequelize.Utils.singularize(row.referenced_table_name)) + toTitleCase(Schema.idSuffix),
                                            row.column_name,
                                            false));
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

    function fixViewNames():void {

        var tableNamesManyForms:string[] = [];

        _.each(schema.tables, extrapolateTableNameForms);

        _.each(schema.tables, fixViewName);

        if (schema.views.length) {
            addViewReferences();
        }

        callback(null, schema);

        function extrapolateTableNameForms(table:Table, index:number, array:Table[]):void {

            if (table.tableName === table.tableName.toLowerCase()) {
                return;
            }

            tableNamesManyForms.push(table.tableName);
            tableNamesManyForms.push(Sequelize.Utils.singularize(table.tableName));
        }

        function fixViewName(table:Table, index:number, array:Table[]):void {

            if (table.tableName !== table.tableName.toLowerCase()) {
                return;
            }
            table.isView = true;
            schema.views.push(table);

            _.each(tableNamesManyForms, fixViewNamePart);

            function fixViewNamePart(otherTableNameForm:string, index:number, array:string[]):void {
                var i:number = table.tableName.indexOf(otherTableNameForm.toLowerCase());
                if (i < 0) {
                    return;
                }

                var newTableName:string = '';

                if (i !== 0) {
                    newTableName = table.tableName.substr(0, i);
                }

                newTableName += otherTableNameForm;

                if (table.tableName.length > i + otherTableNameForm.length + 1) {
                    newTableName += table.tableName.charAt(i + otherTableNameForm.length).toUpperCase() +
                                    table.tableName.substr(i + otherTableNameForm.length + 1);
                }

                table.tableName = newTableName;
            }
        }
    }

    function addViewReferences():void {
        schema.views.forEach(addViewReference);
    }

    function addViewReference(view:Table, index:number, array:Table[]):void {
        view.fields.forEach(addViewFieldReference);

        function addViewFieldReference(field:Field, index:number, array:Field[]):void {
            if (!field.isIdField()) {
                return;
            }

            var otherTableName:string = Sequelize.Utils.pluralize(field.fieldNameProperCase().substr(0, field.fieldName.length - Schema.idSuffix.length), "en");

            var otherTable:Table = tableLookup[otherTableName];
            if (otherTable === undefined) {
                console.log('Unable to find related table for view ' + view.tableName + '.' + field.fieldName + ', expected ' + otherTableName + '.');
                return;
            }

            var reference:Reference = new Reference(otherTableName,
                                                    view.tableName,
                                                    undefined,
                                                    field.fieldName,
                                                    field.fieldName,
                                                    true);

            schema.references.push(reference);

            var otherTableSingular:string = Sequelize.Utils.singularize(otherTableName, 'en');

            view.fields.push(new Field(
                otherTableSingular,
                'types.' + otherTableSingular + 'Pojo',
                view,
                true));

            otherTable.fields.push(new Field(
                util.camelCase(view.tableName),
                'types.' + Sequelize.Utils.singularize(view.tableName, 'en') + 'Pojo[]',
                otherTable,
                true));

        }
    }

}

function toTitleCase(text:string):string {
    return text.charAt(0).toUpperCase() + text.substr(1, text.length - 1);
}
