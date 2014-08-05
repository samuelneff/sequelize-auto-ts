////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See template-definitions.ts for edits
//
////////////////////////////////////////////////////////////////////

/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../lib/sequelize.d.ts" />

import types = require('./sequelize-types');

var Sequelize:sequelize.SequelizeStatic = require('sequelize');

export var initialized:boolean = false;

export var city:types.cityModel;
export var country:types.countryModel;
export var countrylanguage:types.countrylanguageModel;

export function initialize(database:string, username:string, password:string, options:sequelize.Options):void
{
    if (initialized)
    {
        return;
    }

    var sequelize:sequelize.Sequelize = new Sequelize(database, username, password, options);

    city = <types.cityModel> sequelize.define<types.cityInstance, types.cityPojo>('city', {
        'ID':'number',
        'Name':'string',
        'CountryCode':'string',
        'District':'string',
        'Population':'number'
        },
        {
            timestamps: false,
            classMethods: {
                getcity:(city:types.cityPojo) => {
                    var where:{[key:string]:any} = {};
                    if (city['ID'] !== undefined) { where['ID'] = city['ID']}
                    if (city['Name'] !== undefined) { where['Name'] = city['Name']}
                    if (city['CountryCode'] !== undefined) { where['CountryCode'] = city['CountryCode']}
                    if (city['District'] !== undefined) { where['District'] = city['District']}
                    if (city['Population'] !== undefined) { where['Population'] = city['Population']}
                    return this.find({where: where});
                }
            }
        });
    
    country = <types.countryModel> sequelize.define<types.countryInstance, types.countryPojo>('country', {
        'Code':'string',
        'Name':'string',
        'Continent':'string',
        'Region':'string',
        'SurfaceArea':'number',
        'IndepYear':'number',
        'Population':'number',
        'LifeExpectancy':'number',
        'GNP':'number',
        'GNPOld':'number',
        'LocalName':'string',
        'GovernmentForm':'string',
        'HeadOfState':'string',
        'Capital':'number',
        'Code2':'string'
        },
        {
            timestamps: false,
            classMethods: {
                getcountry:(country:types.countryPojo) => {
                    var where:{[key:string]:any} = {};
                    if (country['Code'] !== undefined) { where['Code'] = country['Code']}
                    if (country['Name'] !== undefined) { where['Name'] = country['Name']}
                    if (country['Continent'] !== undefined) { where['Continent'] = country['Continent']}
                    if (country['Region'] !== undefined) { where['Region'] = country['Region']}
                    if (country['SurfaceArea'] !== undefined) { where['SurfaceArea'] = country['SurfaceArea']}
                    if (country['IndepYear'] !== undefined) { where['IndepYear'] = country['IndepYear']}
                    if (country['Population'] !== undefined) { where['Population'] = country['Population']}
                    if (country['LifeExpectancy'] !== undefined) { where['LifeExpectancy'] = country['LifeExpectancy']}
                    if (country['GNP'] !== undefined) { where['GNP'] = country['GNP']}
                    if (country['GNPOld'] !== undefined) { where['GNPOld'] = country['GNPOld']}
                    if (country['LocalName'] !== undefined) { where['LocalName'] = country['LocalName']}
                    if (country['GovernmentForm'] !== undefined) { where['GovernmentForm'] = country['GovernmentForm']}
                    if (country['HeadOfState'] !== undefined) { where['HeadOfState'] = country['HeadOfState']}
                    if (country['Capital'] !== undefined) { where['Capital'] = country['Capital']}
                    if (country['Code2'] !== undefined) { where['Code2'] = country['Code2']}
                    return this.find({where: where});
                }
            }
        });
    
    countrylanguage = <types.countrylanguageModel> sequelize.define<types.countrylanguageInstance, types.countrylanguagePojo>('countrylanguage', {
        'CountryCode':'string',
        'Language':'string',
        'IsOfficial':'string',
        'Percentage':'number'
        },
        {
            timestamps: false,
            classMethods: {
                getcountrylanguage:(countrylanguage:types.countrylanguagePojo) => {
                    var where:{[key:string]:any} = {};
                    if (countrylanguage['CountryCode'] !== undefined) { where['CountryCode'] = countrylanguage['CountryCode']}
                    if (countrylanguage['Language'] !== undefined) { where['Language'] = countrylanguage['Language']}
                    if (countrylanguage['IsOfficial'] !== undefined) { where['IsOfficial'] = countrylanguage['IsOfficial']}
                    if (countrylanguage['Percentage'] !== undefined) { where['Percentage'] = countrylanguage['Percentage']}
                    return this.find({where: where});
                }
            }
        });
    }
