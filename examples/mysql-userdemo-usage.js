var database;
var username;
var password;

var models = require('./mysql-userdemo-generated/sequelize-models');

models.initialize(database, username, password, null);

models.Users.findAll().complete(function (err, users) {
    console.log('Returned ' + users.length + ' users.');

    users.forEach(function (user) {
        console.log(user.UserName + ' (' + user.UserID + ')');
    });
});
//# sourceMappingURL=mysql-userdemo-usage.js.map
