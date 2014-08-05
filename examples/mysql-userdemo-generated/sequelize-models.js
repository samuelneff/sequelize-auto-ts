////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See sequelize-auto-ts for edits
//
////////////////////////////////////////////////////////////////////
var Sequelize = require('sequelize');

exports.initialized = false;

exports.Roles;
exports.Users;

function initialize(database, username, password, options) {
    var _this = this;
    if (exports.initialized) {
        return;
    }

    var sequelize = new Sequelize(database, username, password, options);

    exports.Roles = sequelize.define('Role', {
        'RoleID': 'number',
        'RoleName': 'string'
    }, {
        timestamps: false,
        classMethods: {
            getRole: function (role) {
                var where = {};
                if (role['RoleID'] !== undefined) {
                    where['RoleID'] = role['RoleID'];
                }
                if (role['RoleName'] !== undefined) {
                    where['RoleName'] = role['RoleName'];
                }
                return _this.find({ where: where });
            }
        }
    });

    exports.Users = sequelize.define('User', {
        'UserID': 'number',
        'RoleID': 'number',
        'UserName': 'string'
    }, {
        timestamps: false,
        classMethods: {
            getUser: function (user) {
                var where = {};
                if (user['UserID'] !== undefined) {
                    where['UserID'] = user['UserID'];
                }
                if (user['RoleID'] !== undefined) {
                    where['RoleID'] = user['RoleID'];
                }
                if (user['UserName'] !== undefined) {
                    where['UserName'] = user['UserName'];
                }
                return _this.find({ where: where });
            }
        }
    });
}
exports.initialize = initialize;
//# sourceMappingURL=sequelize-models.js.map
