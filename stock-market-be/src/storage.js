'use strict';
const fs = require('fs');
const storeFiles = require('../config').storeFiles;

exports.save = (fileName) => {
    return async data => {
        fs.writeFileSync(`storage/${fileName}`, JSON.stringify(data));
    }
}

exports.load = filename => {
    const rawdata = fs.readFileSync(`storage/${filename}`);
    let result;
    try {
        result = JSON.parse(rawdata);
    } catch (error) {
        result = {}
    }
    return result;
}

exports.createFiles = () => {
    fs.appendFileSync(`storage/${storeFiles.favourites}`, '');
    fs.appendFileSync(`storage/${storeFiles.searches}`, '');
    fs.appendFileSync(`storage/${storeFiles.companies}`, '');
}

exports.functions = {
    saveFavourites: this.save(storeFiles.favourites),
    loadFavourites: () => this.load(storeFiles.favourites),
    saveSearches: this.save(storeFiles.searches),
    loadSearches: () => this.load(storeFiles.searches),
    saveCompanies: this.save(storeFiles.companies),
    loadCompanies: () => this.load(storeFiles.companies)
}