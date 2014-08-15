/****************************
*
* Loads and exposes schema from database
*/
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./sequelize.d.ts" />
var util = require('./util');

var Sequelize = require("sequelize");

var Schema = (function () {
    function Schema(tables) {
        this.tables = tables;
        this.references = [];
        this.xrefs = [];
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

                if (!idFieldsProcessed[fieldName] && fieldName.length > idSuffixLen && fieldName.substr(fieldName.length - idSuffixLen, idSuffixLen).toLocaleLowerCase() == idSuffix) {
                    idFields.push(field);
                    idFieldsProcessed[fieldName] = true;
                }
            }
        }

        return idFields;
    };
    Schema.idSuffix = "id";

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

    Table.prototype.tableNameSingularCamel = function () {
        var tableName = this.tableNameSingular();
        return tableName.charAt(0).toLowerCase() + tableName.substr(1);
    };

    Table.prototype.nonReferenceFields = function () {
        return this.fields.filter(function (f) {
            return !f.isReference;
        });
    };
    return Table;
})();
exports.Table = Table;

var Field = (function () {
    function Field(fieldName, fieldType, table, isReference) {
        if (typeof isReference === "undefined") { isReference = false; }
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.table = table;
        this.isReference = isReference;
    }
    Field.prototype.fieldNameProperCase = function () {
        return this.fieldName.charAt(0).toUpperCase() + this.fieldName.substr(1, this.fieldName.length - 1);
    };

    Field.prototype.translatedFieldType = function () {
        return Schema.fieldTypeTranslations[this.fieldType];
    };

    Field.prototype.isIdField = function () {
        return Schema.idSuffix != null && Schema.idSuffix.length && this.fieldName.length > Schema.idSuffix.length && this.fieldName.substr(this.fieldName.length - Schema.idSuffix.length, Schema.idSuffix.length).toLowerCase() == Schema.idSuffix;
    };

    Field.prototype.customFieldType = function () {
        return this.isIdField() ? this.fieldNameProperCase() : this.isReference ? this.fieldType : this.translatedFieldType();
    };

    Field.prototype.defineFieldType = function () {
        if (this == this.table.fields[0]) {
            return '{type: "number", primaryKey: true, autoIncrement: true}';
        } else if (this.table.tableName.substr(0, 4) == 'Xref' && this == this.table.fields[1]) {
            return '{type: "number", primaryKey: true}';
        }
        return '\'' + this.translatedFieldType() + '\'';
    };

    Field.prototype.tableNameSingular = function () {
        return this.table.tableNameSingular();
    };

    Field.prototype.tableNameSingularCamel = function () {
        return this.table.tableNameSingularCamel();
    };
    return Field;
})();
exports.Field = Field;

var Reference = (function () {
    function Reference(primaryTableName, foreignTableName, associationName, foreignKey) {
        this.primaryTableName = primaryTableName;
        this.foreignTableName = foreignTableName;
        this.associationName = associationName;
        this.foreignKey = foreignKey;
    }
    return Reference;
})();
exports.Reference = Reference;

var Xref = (function () {
    function Xref(firstTableName, firstFieldName, secondTableName, secondFieldName, xrefTableName) {
        this.firstTableName = firstTableName;
        this.firstFieldName = firstFieldName;
        this.secondTableName = secondTableName;
        this.secondFieldName = secondFieldName;
        this.xrefTableName = xrefTableName;
    }
    return Xref;
})();
exports.Xref = Xref;

function read(database, username, password, options, callback) {
    var schema;
    var sequelize = new Sequelize(database, username, password, options);

    var sql = "select table_name, column_name, data_type " + "from information_schema.columns " + "where table_schema = '" + database + "' " + "order by table_name, ordinal_position";

    sequelize.query(sql).complete(processTablesAndColumns);

    function processTablesAndColumns(err, rows) {
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

            table.fields.push(new Field(row.column_name, row.data_type, table));
        }

        schema = new Schema(tables);

        //callback(null, schema);
        readReferences();
    }

    function readReferences() {
        var sql = "SELECT	table_name, column_name, referenced_table_name, referenced_column_name " + "FROM 	information_schema.key_column_usage " + "WHERE	constraint_schema = '" + database + "' " + "AND	referenced_table_name IS NOT NULL;";

        sequelize.query(sql).complete(processReferences);
    }

    function processReferences(err, rows) {
        if (err) {
            callback(err, null);
            return;
        }

        if (rows == null || rows.length == 0) {
            console.log("Warning: No references defined in database.");
            callback(null, schema);
            return;
        }

        var tableLookup = {};
        var xrefs = {};

        schema.tables.forEach(function (table) {
            return tableLookup[table.tableName] = table;
        });

        rows.forEach(processReferenceRow);

        processReferenceXrefs();

        callback(null, schema);

        function processReferenceRow(row) {
            if (row.table_name.length > 4 && row.table_name.substr(0, 4) == 'Xref') {
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
            parentTable.fields.push(new Field(util.camelCase(row.table_name), Sequelize.Utils.singularize(row.table_name) + 'Pojo[]', parentTable, true));

            // create singular parent reference from child
            childTable.fields.push(new Field(util.camelCase(Sequelize.Utils.singularize(row.referenced_table_name)), Sequelize.Utils.singularize(row.referenced_table_name) + 'Pojo', childTable, true));

            // tell Sequelize about the reference
            schema.references.push(new Reference(row.referenced_table_name, row.table_name, row.column_name == row.referenced_column_name ? row.referenced_table_name : row.column_name.charAt(0).toUpperCase() + row.column_name.substr(1, row.column_name.length - row.referenced_column_name.length - 1) + row.referenced_table_name, row.column_name));
        }

        function processReferenceXrefRow(row) {
            var xref = xrefs[row.table_name];

            if (xref == null) {
                xrefs[row.table_name] = new Xref(row.referenced_table_name, row.referenced_column_name, null, null, row.table_name);
            } else {
                xref.secondTableName = row.referenced_table_name;
                xref.secondFieldName = row.referenced_column_name;
            }
        }

        function processReferenceXrefs() {
            for (var xrefName in xrefs) {
                if (!xrefs.hasOwnProperty(xrefName)) {
                    continue;
                }

                var xref = xrefs[xrefName];

                schema.xrefs.push(xref);

                var firstTable = tableLookup[xref.firstTableName];
                var secondTable = tableLookup[xref.secondTableName];

                firstTable.fields.push(new Field(util.camelCase(xref.secondTableName), Sequelize.Utils.singularize(xref.secondTableName) + 'Pojo[]', firstTable, true));

                secondTable.fields.push(new Field(util.camelCase(xref.firstTableName), Sequelize.Utils.singularize(xref.firstTableName) + 'Pojo[]', secondTable, true));
            }
        }
    }
}
exports.read = read;
//# sourceMappingURL=schema.js.map
