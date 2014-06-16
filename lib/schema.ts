/****************************
 *
 * Loads and exposes schema from database
 */

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/sequelize/sequelize.d.ts" />
/// <reference path="../typings/bluebird/bluebird.d.ts" />
/// <reference path="util" />

var Promise = require("bluebird");

var Sequelize:sequelize.SequelizeStatic = require("sequelize");

export module schema
{
    export class Schema {

        public static idSuffix:string = "_id";

        constructor(public tables:Array<Table>)
        {

        }

        idFields():Array<Field>
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
    }

    export class Field
    {
        constructor(public fieldName:string, public fieldType:string)
        {

        }

        translatedFieldType():string
        {
            return  Schema.idSuffix != null &&
                Schema.idSuffix.length &&
                this.fieldName.length > Schema.idSuffix.length &&
                this.fieldName.substr(this.fieldName.length - Schema.idSuffix.length, Schema.idSuffix.length) == Schema.idSuffix
                ? this.fieldName
                : Schema.fieldTypeTranslations[this.fieldType];
        }
    }

    interface Row
    {
        table_name:string;
        column_name:string;
        data_type:string;
    }

    export function read(database:string, username:string, password:string, options:sequelize.Options):Promise<Schema>
    {
        var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

        var sql:string =
            "select table_name, column_name, data_type " +
            "from information_schema.columns " +
            "where table_schema = '" + database + "' " +
            "order by table_name, ordinal_position";

        return new Promise<Schema>(function (resolve:(schema:Schema) => void, reject:(err:Error) => void)
        {
            sequelize
                .query(sql)
                .complete(function(err:Error, rows:Array<Row>) {
                    processRows(err, rows, resolve, reject);
                });
        });
    }

    function processRows(err:Error, rows:Array<Row>, resolve:(schema:Schema) => void, reject:(err:Error) => void)
    {
        if (err)
        {
            reject(err);
            return;
        }

        if (rows == null)
        {
            var err:Error = new Error("No schema info returned for database.");
            reject(err);
            return;
        }

        if (rows.length == 0)
        {
            var err:Error = new Error("Empty schema info returned for database.");
            reject(err);
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

            table.fields.push(new Field(row.column_name, row.data_type));
        }

        var schema:Schema = new Schema(tables);
        resolve(schema);
    }
}
