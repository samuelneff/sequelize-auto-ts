////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See template-definitions.ts for edits
//
////////////////////////////////////////////////////////////////////
var Sequelize = require('sequelize');

exports.initialized = false;

/*__each__ tables */ exports.__tableName__;

function initialize(database, username, password, options) {
    var _this = this;
    if (exports.initialized) {
        return;
    }

    var sequelize = new Sequelize(database, username, password, options);

    /*__startEach__ tables */
    exports.__tableName__ = sequelize.define('__tableNameSingular__', {
        /*__each__ fields, */ '__fieldName__': '__translatedFieldType__'
    }, {
        timestamps: false,
        classMethods: {
            get__tableNameSingular__: function (__tableNameSingularCamel__) {
                var where = {};
                /*__each__ fields */ if (__tableNameSingularCamel__['__fieldName__'] !== undefined) {
                    where['__fieldName__'] = __tableNameSingularCamel__['__fieldName__'];
                }
                ;
                return _this.find({ where: where });
            }
        }
    });
    /*__endEach__*/
}
exports.initialize = initialize;
//# sourceMappingURL=sequelize-models.js.map
