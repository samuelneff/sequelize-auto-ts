/****************************
 *
 * Loads and exposes schema from database
 */

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./sequelize.d.ts" />
/// <reference path="util" />

var Sequelize:sequelize.SequelizeStatic = require("sequelize");

export class Schema {

    public static idSuffix:string = "Id";

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

        var idFieldsProcessed:Dictionary<boolean> = {};
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
                    fieldName.substr(fieldName.length - idSuffixLen, idSuffixLen) == idSuffix)
                {
                    idFields.push(field);
                    idFieldsProcessed[fieldName] = true;
                }
            }
        }

        return idFields;
    }

    public static fieldTypeTranslations:Dictionary<string> = {

        tinyint: "number",
        smallint: "number",
        int: "number",
        mediumint: "number",
        year: "number",
        float: "number",
        double: "number",

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
        decimal: "string",
        bigint: "string",
        time: "string",
        geometry: "string"
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
}

export class Field
{
    constructor(public fieldName:string, public fieldType:string, public table:Table)
    {

    }

    fieldNameProperCase():string
    {
        return this.fieldName.charAt(0).toUpperCase() + this.fieldName.substr(1, this.fieldName.length - 1);
    }

    translatedFieldType():string
    {
        return Schema.fieldTypeTranslations[this.fieldType];
    }

    customFieldType():string
    {
        return  Schema.idSuffix != null &&
            Schema.idSuffix.length &&
            this.fieldName.length > Schema.idSuffix.length &&
            this.fieldName.substr(this.fieldName.length - Schema.idSuffix.length, Schema.idSuffix.length) == Schema.idSuffix
            ? this.fieldNameProperCase()
            : this.translatedFieldType();
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

interface Row
{
    table_name:string;
    column_name:string;
    data_type:string;
}

export function read(database:string, username:string, password:string, options:sequelize.Options, callback:(err:Error, schema:Schema) => void):void
{
    var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

    var sql:string =
        "select table_name, column_name, data_type " +
        "from information_schema.columns " +
        "where table_schema = '" + database + "' " +
        "order by table_name, ordinal_position";

    sequelize
        .query(sql)
        .complete(function(err:Error, rows:Array<Row>) {
            processRows(err, rows, callback);
        });
}

function processRows(err:Error, rows:Array<Row>, callback:(err:Error, schema:Schema) => void):void
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
        var row:Row = rows[index];

        if (row.table_name != table.tableName)
        {
            table = new Table(row.table_name);
            tables.push(table);
        }

        table.fields.push(new Field(row.column_name, row.data_type, table));
    }

    var schema:Schema = new Schema(tables);
    callback(null, schema);
}
