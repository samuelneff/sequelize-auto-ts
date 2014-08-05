////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See sequelize-auto-ts for edits
//
////////////////////////////////////////////////////////////////////

/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../lib/sequelize.d.ts" />

import types = require('./sequelize-types');

var Sequelize:sequelize.SequelizeStatic = require('sequelize');

export var initialized:boolean = false;

export var Roles:types.RolesModel;
export var Users:types.UsersModel;

export function initialize(database:string, username:string, password:string, options:sequelize.Options):void
{
    if (initialized)
    {
        return;
    }

    var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

    Roles = <types.RolesModel> sequelize.define<types.RoleInstance, types.RolePojo>('Role', {
        'RoleID':'number',
        'RoleName':'string'
        },
        {
            timestamps: false,
            classMethods: {
                getRole:(role:types.RolePojo) => {
                    var where:{[key:string]:any} = {};
                    if (role['RoleID'] !== undefined) { where['RoleID'] = role['RoleID']}
                    if (role['RoleName'] !== undefined) { where['RoleName'] = role['RoleName']}
                    return this.find({where: where});
                }
            }
        });
    
    Users = <types.UsersModel> sequelize.define<types.UserInstance, types.UserPojo>('User', {
        'UserID':'number',
        'RoleID':'number',
        'UserName':'string'
        },
        {
            timestamps: false,
            classMethods: {
                getUser:(user:types.UserPojo) => {
                    var where:{[key:string]:any} = {};
                    if (user['UserID'] !== undefined) { where['UserID'] = user['UserID']}
                    if (user['RoleID'] !== undefined) { where['RoleID'] = user['RoleID']}
                    if (user['UserName'] !== undefined) { where['UserName'] = user['UserName']}
                    return this.find({where: where});
                }
            }
        });
    }
