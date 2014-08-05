////////////////////////////////////////////////////////////////////
//
// GENERATED CLASS
//
// DO NOT EDIT
//
// See schemaInfoTemplate for edits
//
////////////////////////////////////////////////////////////////////

/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../lib/sequelize.d.ts" />

export interface cityPojo
{
    ID?:number;
    Name?:string;
    CountryCode?:string;
    District?:string;
    Population?:number;
}

export interface cityInstance extends sequelize.Instance<cityInstance, cityPojo>, cityPojo { }

export interface cityModel extends sequelize.Model<cityInstance, cityPojo> {
    getcity:(city:cityPojo) => sequelize.PromiseT<cityInstance>;
}

export interface countryPojo
{
    Code?:string;
    Name?:string;
    Continent?:string;
    Region?:string;
    SurfaceArea?:number;
    IndepYear?:number;
    Population?:number;
    LifeExpectancy?:number;
    GNP?:number;
    GNPOld?:number;
    LocalName?:string;
    GovernmentForm?:string;
    HeadOfState?:string;
    Capital?:number;
    Code2?:string;
}

export interface countryInstance extends sequelize.Instance<countryInstance, countryPojo>, countryPojo { }

export interface countryModel extends sequelize.Model<countryInstance, countryPojo> {
    getcountry:(country:countryPojo) => sequelize.PromiseT<countryInstance>;
}

export interface countrylanguagePojo
{
    CountryCode?:string;
    Language?:string;
    IsOfficial?:string;
    Percentage?:number;
}

export interface countrylanguageInstance extends sequelize.Instance<countrylanguageInstance, countrylanguagePojo>, countrylanguagePojo { }

export interface countrylanguageModel extends sequelize.Model<countrylanguageInstance, countrylanguagePojo> {
    getcountrylanguage:(countrylanguage:countrylanguagePojo) => sequelize.PromiseT<countrylanguageInstance>;
}

