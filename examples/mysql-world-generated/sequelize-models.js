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

exports.city;
exports.country;
exports.countrylanguage;

function initialize(database, username, password, options) {
    var _this = this;
    if (exports.initialized) {
        return;
    }

    var sequelize = new Sequelize(database, username, password, options);

    exports.city = sequelize.define('city', {
        'ID': 'number',
        'Name': 'string',
        'CountryCode': 'string',
        'District': 'string',
        'Population': 'number'
    }, {
        timestamps: false,
        classMethods: {
            getcity: function (city) {
                var where = {};
                if (city['ID'] !== undefined) {
                    where['ID'] = city['ID'];
                }
                if (city['Name'] !== undefined) {
                    where['Name'] = city['Name'];
                }
                if (city['CountryCode'] !== undefined) {
                    where['CountryCode'] = city['CountryCode'];
                }
                if (city['District'] !== undefined) {
                    where['District'] = city['District'];
                }
                if (city['Population'] !== undefined) {
                    where['Population'] = city['Population'];
                }
                return _this.find({ where: where });
            }
        }
    });

    exports.country = sequelize.define('country', {
        'Code': 'string',
        'Name': 'string',
        'Continent': 'string',
        'Region': 'string',
        'SurfaceArea': 'number',
        'IndepYear': 'number',
        'Population': 'number',
        'LifeExpectancy': 'number',
        'GNP': 'number',
        'GNPOld': 'number',
        'LocalName': 'string',
        'GovernmentForm': 'string',
        'HeadOfState': 'string',
        'Capital': 'number',
        'Code2': 'string'
    }, {
        timestamps: false,
        classMethods: {
            getcountry: function (country) {
                var where = {};
                if (country['Code'] !== undefined) {
                    where['Code'] = country['Code'];
                }
                if (country['Name'] !== undefined) {
                    where['Name'] = country['Name'];
                }
                if (country['Continent'] !== undefined) {
                    where['Continent'] = country['Continent'];
                }
                if (country['Region'] !== undefined) {
                    where['Region'] = country['Region'];
                }
                if (country['SurfaceArea'] !== undefined) {
                    where['SurfaceArea'] = country['SurfaceArea'];
                }
                if (country['IndepYear'] !== undefined) {
                    where['IndepYear'] = country['IndepYear'];
                }
                if (country['Population'] !== undefined) {
                    where['Population'] = country['Population'];
                }
                if (country['LifeExpectancy'] !== undefined) {
                    where['LifeExpectancy'] = country['LifeExpectancy'];
                }
                if (country['GNP'] !== undefined) {
                    where['GNP'] = country['GNP'];
                }
                if (country['GNPOld'] !== undefined) {
                    where['GNPOld'] = country['GNPOld'];
                }
                if (country['LocalName'] !== undefined) {
                    where['LocalName'] = country['LocalName'];
                }
                if (country['GovernmentForm'] !== undefined) {
                    where['GovernmentForm'] = country['GovernmentForm'];
                }
                if (country['HeadOfState'] !== undefined) {
                    where['HeadOfState'] = country['HeadOfState'];
                }
                if (country['Capital'] !== undefined) {
                    where['Capital'] = country['Capital'];
                }
                if (country['Code2'] !== undefined) {
                    where['Code2'] = country['Code2'];
                }
                return _this.find({ where: where });
            }
        }
    });

    exports.countrylanguage = sequelize.define('countrylanguage', {
        'CountryCode': 'string',
        'Language': 'string',
        'IsOfficial': 'string',
        'Percentage': 'number'
    }, {
        timestamps: false,
        classMethods: {
            getcountrylanguage: function (countrylanguage) {
                var where = {};
                if (countrylanguage['CountryCode'] !== undefined) {
                    where['CountryCode'] = countrylanguage['CountryCode'];
                }
                if (countrylanguage['Language'] !== undefined) {
                    where['Language'] = countrylanguage['Language'];
                }
                if (countrylanguage['IsOfficial'] !== undefined) {
                    where['IsOfficial'] = countrylanguage['IsOfficial'];
                }
                if (countrylanguage['Percentage'] !== undefined) {
                    where['Percentage'] = countrylanguage['Percentage'];
                }
                return _this.find({ where: where });
            }
        }
    });
}
exports.initialize = initialize;
//# sourceMappingURL=sequelize-models.js.map
