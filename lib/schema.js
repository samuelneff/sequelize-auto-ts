/****************************
*
* Loads and exposes schema from database
*/
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/sequelize/sequelize.d.ts" />
/// <reference path="../typings/bluebird/bluebird.d.ts" />
/// <reference path="util" />
var Promise = require("bluebird");

var Sequelize = require("sequelize");

(function (_schema) {
    var Schema = (function () {
        function Schema(tables) {
            this.tables = tables;
        }
        Schema.prototype.idFields = function () {
            var idSuffix = Schema.idSuffix;

            if (idSuffix == null || !idSuffix.length) {
                return [];
            }

            var idFieldsProcessed = {};
            var idFields = [];

            var idSuffixLen = idSuffix.length;

            for (var tableIndex = 0; tableIndex < this.tables.length; tableIndex++) {
                var table = this.tables[tableIndex];

                if (table == null || table.fields == null) {
                    continue;
                }

                for (var fieldIndex = 0; fieldIndex < table.fields.length; fieldIndex++) {
                    var field = table.fields[fieldIndex];
                    var fieldName = field.fieldName;

                    if (!idFieldsProcessed[fieldName] && fieldName.length > idSuffixLen && fieldName.substr(fieldName.length - idSuffixLen, idSuffixLen) == idSuffix) {
                        idFields.push(field);
                        idFieldsProcessed[fieldName] = true;
                    }
                }
            }

            return idFields;
        };
        Schema.idSuffix = "_id";

        Schema.fieldTypeTranslations = {
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
        return Schema;
    })();
    _schema.Schema = Schema;

    var Table = (function () {
        function Table(tableName) {
            this.tableName = tableName;
            this.fields = [];
        }
        return Table;
    })();
    _schema.Table = Table;

    var Field = (function () {
        function Field(fieldName, fieldType) {
            this.fieldName = fieldName;
            this.fieldType = fieldType;
        }
        Field.prototype.translatedFieldType = function () {
            return Schema.idSuffix != null && Schema.idSuffix.length && this.fieldName.length > Schema.idSuffix.length && this.fieldName.substr(this.fieldName.length - Schema.idSuffix.length, Schema.idSuffix.length) == Schema.idSuffix ? this.fieldName : Schema.fieldTypeTranslations[this.fieldType];
        };
        return Field;
    })();
    _schema.Field = Field;

    function read(database, username, password, options) {
        var sequelize = new Sequelize(database, username, password, options);

        var sql = "select table_name, column_name, data_type " + "from information_schema.columns " + "where table_schema = '" + database + "' " + "order by table_name, ordinal_position";

        return new Promise(function (resolve, reject) {
            sequelize.query(sql).complete(function (err, rows) {
                processRows(err, rows, resolve, reject);
            });
        });
    }
    _schema.read = read;

    function processRows(err, rows, resolve, reject) {
        if (err) {
            reject(err);
            return;
        }

        if (rows == null) {
            var err = new Error("No schema info returned for database.");
            reject(err);
            return;
        }

        if (rows.length == 0) {
            var err = new Error("Empty schema info returned for database.");
            reject(err);
            return;
        }

        var tables = [];
        var table = new Table("");

        for (var index = 0; index < rows.length; index++) {
            var row = rows[index];

            if (row.table_name != table.tableName) {
                table = new Table(row.table_name);
                tables.push(table);
            }

            table.fields.push(new Field(row.column_name, row.data_type));
        }

        var schema = new Schema(tables);
        resolve(schema);
    }
})(exports.schema || (exports.schema = {}));
var schema = exports.schema;
//# sourceMappingURL=schema.js.map
