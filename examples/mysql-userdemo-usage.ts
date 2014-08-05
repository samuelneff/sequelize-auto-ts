var database:string;
var username:string;
var password:string;

import types = require('./mysql-userdemo-generated/sequelize-types');
import models = require('./mysql-userdemo-generated/sequelize-models');

models.initialize(database, username, password, null);

models.Users.findAll().complete((err:Error, users:types.UserInstance[]) => {

    console.log('Returned ' + users.length + ' users.');

    users.forEach( (user:types.UserPojo) => {
        console.log(user.UserName + ' (' + user.UserID + ')');
    })
});