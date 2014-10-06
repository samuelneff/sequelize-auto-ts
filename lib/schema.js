/****************************
*
* Loads and exposes schema from database
*/
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./sequelize.d.ts" />
var util = require('./util');

var Sequelize = require("sequelize");

var _ = Sequelize.Utils._;

var Schema = (function () {
    function Schema(tables) {
        this.tables = tables;
        this.references = [];
        this.xrefs = [];
        this.associations = [];
        this.calculatedFields = [];
        this.views = [];
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

    Schema.prototype.uniqueReferences = function () {
        var u = [];

        var foundIds = {};

        this.references.forEach(addReferenceIfUnique);

        this.tables.forEach(addTablePrimaryKeys);

        return u;

        function addReferenceIfUnique(reference, index, array) {
            if (reference.isView || foundIds[reference.foreignKey]) {
                return;
            }

            u.push(reference);

            foundIds[reference.foreignKey] = true;
        }

        function addTablePrimaryKeys(table, index, array) {
            if (table.isView || table.tableName.substr(0, 4) === 'Xref') {
                return;
            }
            var pk = table.fields[0];

            if (foundIds[pk.fieldName]) {
                return;
            }
            foundIds[pk.fieldName] = true;

            var r = new Reference(table.tableName, table.tableName, undefined, pk.fieldName, pk.fieldName, false);
            u.push(r);
        }
    };
    Schema.idSuffix = "id";

    Schema.fieldTypeTranslations = {
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

    Schema.fieldTypeSequelize = {
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
    return Schema;
})();
exports.Schema = Schema;

var Table = (function () {
    function Table(tableName) {
        this.tableName = tableName;
        this.fields = [];
        this.isView = false;
    }
    Table.prototype.tableNameSingular = function () {
        return Sequelize.Utils.singularize(this.tableName, "en");
    };

    Table.prototype.tableNameSingularCamel = function () {
        var tableName = this.tableNameSingular();
        return tableName.charAt(0).toLowerCase() + tableName.substr(1);
    };

    Table.prototype.realDbFields = function () {
        return this.fields.filter(function (f) {
            return !f.isReference && !f.isCalculated;
        });
    };
    Table.prototype.idField = function () {
        return _.find(this.fields, function (f) {
            return f.isIdField();
        });
    };

    Table.prototype.idFieldName = function () {
        var idField = this.idField();
        if (idField === undefined) {
            console.log('Unable to find ID field for type: ' + this.tableName);
            return '!!cannotFindIdFieldOn' + this.tableName + '!!';
        }
        return idField.fieldName;
    };

    Table.prototype.idFieldNameTitleCase = function () {
        var idField = this.idField();
        if (idField === undefined) {
            console.log('Unable to find ID field for type: ' + this.tableName);
            return '!!cannotFindIdFieldOn' + this.tableName + '!!';
        }
        return idField.fieldNameProperCase();
    };
    return Table;
})();
exports.Table = Table;

var Field = (function () {
    function Field(fieldName, fieldType, table, isReference, isCalculated) {
        if (typeof isReference === "undefined") { isReference = false; }
        if (typeof isCalculated === "undefined") { isCalculated = false; }
        this.fieldName = fieldName;
        this.fieldType = fieldType;
        this.table = table;
        this.isReference = isReference;
        this.isCalculated = isCalculated;
    }
    Field.prototype.fieldNameProperCase = function () {
        return toTitleCase(this.fieldName);
    };

    Field.prototype.translatedFieldType = function () {
        var translated = Schema.fieldTypeTranslations[this.fieldType];
        if (translated == undefined) {
            if (this.fieldType.length < 6 || this.fieldType.substr(0, 6) !== 'types.') {
                console.log('Unable to translate field type:' + this.fieldType);
            }
            translated = this.fieldType;
        }
        return translated;
    };

    Field.prototype.sequelizeFieldType = function () {
        var translated = Schema.fieldTypeSequelize[this.fieldType];
        if (translated == undefined) {
            console.log('Unable to sequelize field type:' + this.fieldType);
            translated = this.fieldType;
        }
        return translated;
    };

    Field.prototype.isIdField = function () {
        return Schema.idSuffix != null && Schema.idSuffix.length && this.fieldName.length > Schema.idSuffix.length && this.fieldName.substr(this.fieldName.length - Schema.idSuffix.length, Schema.idSuffix.length).toLowerCase() == Schema.idSuffix;
    };

    Field.prototype.customFieldType = function () {
        return this.isIdField() ? this.fieldNameProperCase() : this.isReference ? this.fieldType : this.translatedFieldType();
    };

    Field.prototype.defineFieldType = function () {
        if (this == this.table.fields[0]) {
            return '{type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true}';
        } else if (this.table.tableName.substr(0, 4) == 'Xref' && this == this.table.fields[1]) {
            return '{type: "number", primaryKey: true}';
        }
        return this.sequelizeFieldType();
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
    function Reference(primaryTableName, foreignTableName, associationName, primaryKey, foreignKey, isView) {
        this.primaryTableName = primaryTableName;
        this.foreignTableName = foreignTableName;
        this.associationName = associationName;
        this.primaryKey = primaryKey;
        this.foreignKey = foreignKey;
        this.isView = isView;
    }
    Reference.prototype.associationNameQuoted = function () {
        return this.associationName ? '\'' + this.associationName + '\'' : undefined;
    };
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

// Associations are named foreign keys, like OwnerUserID
var Association = (function () {
    function Association(associationName) {
        this.associationName = associationName;
    }
    return Association;
})();
exports.Association = Association;

function read(database, username, password, options, callback) {
    var schema;
    var sequelize = new Sequelize(database, username, password, options);
    var tableLookup = {};
    var xrefs = {};
    var associationsFound = {};

    var sql = "select table_name, column_name, data_type, ordinal_position " + "from information_schema.columns " + "where table_schema = '" + database + "' " + "order by table_name, ordinal_position";

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

        readCustomFields(rows);
    }

    function readCustomFields(originalRows) {
        if (!_.any(originalRows, function (r) {
            return r.table_name == 'SequelizeCustomFieldDefinitions';
        })) {
            processTablesAndColumnsWithCustom(originalRows, {});
            return;
        }

        var sql = "select table_name, column_name, data_type, ordinal_position " + "from SequelizeCustomFieldDefinitions " + "order by table_name, ordinal_position";

        sequelize.query(sql).complete(processCustomFields);

        function processCustomFields(err, customFields) {
            if (err) {
                callback(err, null);
                return;
            }

            var customFieldLookup = util.arrayToDictionary(customFields, 'column_name');

            var combined = originalRows.concat(customFields);
            combined.sort(sortByTableNameThenOrdinalPosition);

            processTablesAndColumnsWithCustom(combined, customFieldLookup);
        }
    }

    function sortByTableNameThenOrdinalPosition(row1, row2) {
        return row1.table_name < row2.table_name ? -1 : (row1.table_name > row2.table_name ? 1 : (row1.ordinal_position < row2.ordinal_position ? -1 : (row1.ordinal_position > row2.ordinal_position ? 1 : 0)));
    }

    function processTablesAndColumnsWithCustom(rows, customFieldLookup) {
        var tables = [];
        var table = new Table("");

        schema = new Schema(tables);

        for (var index = 0; index < rows.length; index++) {
            var row = rows[index];

            if (row.table_name != table.tableName) {
                table = new Table(row.table_name);
                tables.push(table);
            }

            var isCalculated = customFieldLookup[row.column_name] !== undefined;

            var field = new Field(row.column_name, row.data_type, table, false, isCalculated);
            ;
            table.fields.push(field);

            if (isCalculated) {
                schema.calculatedFields.push(field);
            }
        }

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

        schema.tables.forEach(function (table) {
            return tableLookup[table.tableName] = table;
        });

        rows.forEach(processReferenceRow);

        processReferenceXrefs();

        fixViewNames();

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

            var associationName;

            if (row.column_name == row.referenced_column_name) {
                associationName = undefined;
            } else {
                // example, row.column_name is ownerUserID
                // we want association to be called OwnerUsers
                // so we take first character and make it uppercase,
                // then take rest of prefix from foreign key
                // then append the referenced table name
                associationName = row.column_name.charAt(0).toUpperCase() + row.column_name.substr(1, row.column_name.length - row.referenced_column_name.length - 1) + row.referenced_table_name;

                if (!associationsFound[associationName]) {
                    schema.associations.push(new Association(associationName));
                    associationsFound[associationName] = true;
                }
            }

            // tell Sequelize about the reference
            schema.references.push(new Reference(row.referenced_table_name, row.table_name, associationName, util.camelCase(Sequelize.Utils.singularize(row.referenced_table_name)) + toTitleCase(Schema.idSuffix), row.column_name, false));
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

    function fixViewNames() {
        var tableNamesManyForms = [];

        _.each(schema.tables, extrapolateTableNameForms);

        _.each(schema.tables, fixViewName);

        if (schema.views.length) {
            addViewReferences();
        }

        callback(null, schema);

        function extrapolateTableNameForms(table, index, array) {
            if (table.tableName === table.tableName.toLowerCase()) {
                return;
            }

            tableNamesManyForms.push(table.tableName);
            tableNamesManyForms.push(Sequelize.Utils.singularize(table.tableName));
        }

        function fixViewName(table, index, array) {
            if (table.tableName !== table.tableName.toLowerCase()) {
                return;
            }
            table.isView = true;
            schema.views.push(table);

            _.each(tableNamesManyForms, fixViewNamePart);

            function fixViewNamePart(otherTableNameForm, index, array) {
                var i = table.tableName.indexOf(otherTableNameForm.toLowerCase());
                if (i < 0) {
                    return;
                }

                var newTableName = '';

                if (i !== 0) {
                    newTableName = table.tableName.substr(0, i);
                }

                newTableName += otherTableNameForm;

                if (table.tableName.length > i + otherTableNameForm.length + 1) {
                    newTableName += table.tableName.charAt(i + otherTableNameForm.length).toUpperCase() + table.tableName.substr(i + otherTableNameForm.length + 1);
                }

                table.tableName = newTableName;
            }
        }
    }

    function addViewReferences() {
        schema.views.forEach(addViewReference);
    }

    function addViewReference(view, index, array) {
        view.fields.forEach(addViewFieldReference);

        function addViewFieldReference(field, index, array) {
            if (!field.isIdField()) {
                return;
            }

            var otherTableName = Sequelize.Utils.pluralize(field.fieldNameProperCase().substr(0, field.fieldName.length - Schema.idSuffix.length), "en");

            var otherTable = tableLookup[otherTableName];
            if (otherTable === undefined) {
                console.log('Unable to find related table for view ' + view.tableName + '.' + field.fieldName + ', expected ' + otherTableName + '.');
                return;
            }

            var reference = new Reference(otherTableName, view.tableName, undefined, field.fieldName, field.fieldName, true);

            schema.references.push(reference);

            var otherTableSingular = Sequelize.Utils.singularize(otherTableName, 'en');

            view.fields.push(new Field(otherTableSingular, 'types.' + otherTableSingular + 'Pojo', view, true));

            otherTable.fields.push(new Field(util.camelCase(view.tableName), 'types.' + Sequelize.Utils.singularize(view.tableName, 'en') + 'Pojo[]', otherTable, true));
        }
    }
}
exports.read = read;

function toTitleCase(text) {
    return text.charAt(0).toUpperCase() + text.substr(1, text.length - 1);
}
//# sourceMappingURL=schema.js.map
