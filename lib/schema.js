/****************************
*
* Loads and exposes schema from database
*/
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/sequelize/sequelize.d.ts" />
/// <reference path="util" />
var Sequelize = require("sequelize");

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
    Schema.idSuffix = "Id";

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
exports.Schema = Schema;

var Table = (function () {
    function Table(tableName) {
        this.tableName = tableName;
        this.fields = [];
    }
    Table.prototype.tableNameSingular = function () {
        return Sequelize.Utils.singularize(this.tableName, "en");
    };
    return Table;
})();
exports.Table = Table;

var Field = (function () {
    function Field(fieldName, fieldType) {
        this.fieldName = fieldName;
        this.fieldType = fieldType;
    }
    Field.prototype.fieldNameProperCase = function () {
        return this.fieldName.charAt(0).toUpperCase() + this.fieldName.substr(1, this.fieldName.length - 1);
    };

    Field.prototype.translatedFieldType = function () {
        return Schema.fieldTypeTranslations[this.fieldType];
    };

    Field.prototype.customFieldType = function () {
        return Schema.idSuffix != null && Schema.idSuffix.length && this.fieldName.length > Schema.idSuffix.length && this.fieldName.substr(this.fieldName.length - Schema.idSuffix.length, Schema.idSuffix.length) == Schema.idSuffix ? this.fieldNameProperCase() : this.translatedFieldType();
    };
    return Field;
})();
exports.Field = Field;

function read(database, username, password, options, callback) {
    var sequelize = new Sequelize(database, username, password, options);

    var sql = "select table_name, column_name, data_type " + "from information_schema.columns " + "where table_schema = '" + database + "' " + "order by table_name, ordinal_position";

    sequelize.query(sql).complete(function (err, rows) {
        processRows(err, rows, callback);
    });
}
exports.read = read;

function processRows(err, rows, callback) {
    if (err) {
        callback(err, null);
        return;
    }

    if (rows == null) {
        var err = new Error("No schema info returned for database.");
        callback(err, null);
        return;
    }

    if (rows.length == 0) {
        var err = new Error("Empty schema info returned for database.");
        callback(err, null);
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
    callback(null, schema);
}
//# sourceMappingURL=schema.js.map
