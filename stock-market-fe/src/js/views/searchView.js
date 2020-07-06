import {elements, buildDts, buildOptions} from './base'

export const searchOptions = function(array) {
    buildOptions(array, elements.searchCompaniesList);
}

export const searchResults = function(array) {
    buildDts(array, elements.stockMarketsList);
}