sequelize-auto-ts
=================

Generate Sequelize definition statements and compatible TypeScript definitions from a MySQL database schema.

# Versions Note, April 2019

This is an old project that was written for Node 0.10 and Sequelize 1.7. It is not maintained. If anyone creates a fork that is compatible to the most recent version, I'll be happy to link to that fork. Sam

# Running sequelize-auto-ts

Use node to execute `lib\cli.js` and pass in four required parameters: database, username, password, and target directory.

```
c:\sequelize-auto-ts>node lib\cli.js world root rootPassword c:\my-project\src\models
```

# Version 1.0.3 documentation

I pushed version 1.0.3 to NPM on 1/18/15 but have not updated the documentation yet. This version has a lot of new features. I'll update the documentation as soon as I can. If there is anything specific that should be updated or questions you have please create an issue in GitHub.

# Generated files

sequelize-auto-ts will generate two custom files in the target directory and copy one or two definition files.

`sequelize-types.ts`

This file contains interfaces for all of the tables in the database. Three interfaces are created for each table as well as an interface for each ID field.  These are explained in detail below.

`sequelize-models.ts`

This file contains all of the Sequelize model definitions. This module exposes an `initialize` function which defines all of the models (tables) within Sequelize. This method must be called before any of the sequelize-auto-ts generated instances can be used. In addition to the `instance` method, a single model variable is exposed for each table which is then used to query individual tables.

`sequelize.d.ts`

This is definitions for all of the core Sequelize functionality. It is copied to the target if it is not found in the target project. The project is defined as the first parent folder of the target directory that contains a `package.json` file. If you prefer to place all of your library definition files in a specific directory, move this file to your desired directory within your project and re-run sequelize-auto-ts. sequelize-auto-ts will find the file and calculate the proper relative paths to be used in `sequelize-models.ts` and `sequelize-types.ts`.

`node.d.ts`

This is the definition file for Node. As with `sequelize.d.ts` if it is found in the target project the existing definition file will be referenced. If the file is not found, then it is copied to the target directory. Note that sequelize-auto-ts will not reference any definition file underneath `node_modules`.

# Demo Database Schema

For the rest of the explanation we'll use a very simple database with two tables and a relationship between them. It is defined as follows:

```SQL
CREATE TABLE Roles (
	RoleID INTEGER PRIMARY KEY AUTO_INCREMENT,
	RoleName VARCHAR(255) NOT NULL
);

CREATE TABLE Users (
	UserID INTEGER PRIMARY KEY AUTO_INCREMENT,
	RoleID INTEGER NOT NULL,
	UserName VARCHAR(255) NOT NULL,

	FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);
```

# Generated Interfaces

For this simple database with just two tables, sequelize-auto-ts will generate eight interfaces in `sequelize-types.ts`.

```JS
export interface RoleID { RoleID:number; }
export interface UserID { UserID:number; }
```

First we generate an interface for all recognized ID fields. This is a bit of a trick to help prevent accidentally assigning an ID type from one table to another, example, passing a `UserID` when you meant to pass a `RoleID`. Note the values are actually just a number, not an object containing the field and number.

```JS
export interface RolePojo
{
    RoleID?:number;
    RoleName?:string;
    users?:UserPojo[];
}

export interface UserPojo
{
    UserID?:number;
    RoleID?:number;
    UserName?:string;
    role?:RolePojo;
}
```

Next for each table we genearte a plain JavaScript object, with the table name followed by `Pojo`. This base type is used in some input methods so they can easily be generated from scratch and are also returned from instance methods (defined below) by the `toJSON` method.

```JS
export interface RoleInstance extends sequelize.Instance<RoleInstance, RolePojo>, RolePojo { }

export interface UserInstance extends sequelize.Instance<UserInstance, UserPojo>, UserPojo { }
```

Each table then gets an `Instance` interface. This interface represents the object actually returned by Sequelize for each database entity. This interface extends the corresponding `Pojo` interface and thus has an interface field for every database field. It additionally extends `sequelize.Instance` which defines all of the Sequelize methods and fields available on instances, such as `get()`, `set()`, `save()`, etc. For a full list of available methods see the Sequelize documentation or refer to `sequelize.d.ts`.

Note that the `Instance` instances have circular references and cannot be directly converted to JSON. Instead call either the `toJSON()` method or use the `values` field to return the plain `Pojo` corresponding to the `Instance` which can then be converted to JSON.

```JS
export interface RolesModel extends sequelize.Model<RoleInstance, RolePojo> {
    getRole:(role:RolePojo) => sequelize.PromiseT<RoleInstance>;
}

export interface UsersModel extends sequelize.Model<UserInstance, UserPojo> {
    getUser:(user:UserPojo) => sequelize.PromiseT<UserInstance>;
}
```

Lastly a `Model` interface is defined for each table. Later in the `sequelize-models.ts` file we'll instantiate a single variable for each model which is used to query the database and act on the table. In addition to the standard methods and fields defined by Sequelize on each model, sequelize-auto-ts also provides a helper `getXxx()` method which is a shortcut for `get()`. Using `getXxx()` you can pass a pojo directly, containing any subset of fields, and Sequelize will query for a single row matching the values provided.

Note that you are unlikely to ever define an instance of the model interfaces yourself--they are provided in `sequelize-model.ts`.

# Generated Sequelize Definitions and Models

One model for each table along with the proper initialization (`define()`) call is generated in `sequelize-models.ts`.

The important method is `initialize()`:

```JS
export function initialize(database:string, username:string, password:string, options:sequelize.Options):void {
   ...
}
```

Call this function to define all of the models within Sequelize. It must be called once prior to using Sequelize through sequelize-auto-ts generated types.

Then for each table, a single model instance is defined:

```JS
export var Roles:types.RolesModel;
export var Users:types.UsersModel;
```

This allows you to quickly query the database through Sequelize's API and return typed objects. For example, to query a list of users:

```JS
import types = require('./mysql-userdemo-generated/sequelize-types');
import models = require('./mysql-userdemo-generated/sequelize-models');

models.initialize(database, username, password, null);

models.Users.findAll().complete((err:Error, users:types.UserInstance[]) => {

    console.log('Returned ' + users.length + ' users.');

    users.forEach( (user:types.UserPojo) => {
        console.log(user.UserName + ' (' + user.UserID + ')');
    })
});
```

In the above example, `findAll().complete()` takes a typed callback. If the argument types are not defined correctly, TypeScript will give a proper syntax error. 




# Table names on MySQL and Windows

Table and database names are stored on disk using the lettercase specified in the CREATE TABLE or
CREATE DATABASE statement, but MySQL converts them to lowercase on lookup. Name comparisons are not case sensitive.

http://dev.mysql.com/doc/refman/5.0/en/identifier-case-sensitivity.html

lower_case_table_names=2

# License

The MIT License (MIT). Copyright (c) 2014 Samuel Neff. See [MIT LICENSE](https://github.com/samuelneff/sequelize-auto-ts/blob/master/LICENSE).

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsamuelneff%2Fsequelize-auto-ts.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsamuelneff%2Fsequelize-auto-ts?ref=badge_large)
