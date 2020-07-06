// Global app controller
import Search from './models/Search';
import Company from './models/Company';
import Favourites from './models/Favourites';

import { searchResults, searchOptions } from './views/searchView';
import { changeTitle, changeChart, defaultChart, changeIframe } from './views/companyView';
import { favouritesList, changeIcon } from './views/favouritesView';

import { elements, renderLoader } from './views/base';

const state = {};

const controlCompany = async (symbol, name) => {
    if (name) {
        if (state.company && state.company.name === name) return;
        state.company = new Company(symbol, name);
        changeTitle(state.company.name);
        renderLoader(elements.companyChart);

        const wikiLink = state.company.getWikipediaUrl();
        const data = await state.company.getData('MONTHLY');

        changeChart(data);

        if (state.favourites) {
            changeIcon(state.favourites.list.indexOf(state.company.fullname) !== -1);
        }
        wikiLink.then(url => changeIframe(url));
    }
    else {
        defaultChart();
        changeIframe('');
        changeTitle('');
        changeIcon(false);
    }
}

const controlSearch = async () => {
    const query = elements.searchField.value;
    elements.searchField.value = '';

    if(query) {
        state.search = new Search(query);
        renderLoader(elements.stockMarketsList);

        await state.search.searchCompanies();

        searchResults(state.search.results);
        addControlCompanyToList(elements.stockMarketsList.children);

    }
}

function controlFavourites() {
    
    if(state.company)
        changeIcon() ? state.favourites.add(state.company.fullname) : state.favourites.remove(state.company.fullname);

    state.favourites.update();
    favouritesList(state.favourites.list);
    addControlCompanyToList(elements.favouritesList.children);
}

function addControlCompanyToList(elements) {
    Array.from(elements).map(i => i.addEventListener('click', e => {
        e.preventDefault();
        controlCompany(...i.textContent.split('-'));
    }));
}

async function reset() {
    state.favourites = new Favourites();
    renderLoader(elements.favouritesList);
    const gettingFavourites = state.favourites.initList();
    searchOptions(['Amazon', 'Apple', 'Google', 'Microsoft']);

    controlCompany('');
    controlSearch();

    elements.searchBtn.addEventListener('click', e => {
        e.preventDefault();
        controlSearch();
    });

    gettingFavourites.then(x => {
        favouritesList(state.favourites.list);
        addControlCompanyToList(elements.favouritesList.children);
        elements.starIcon.addEventListener('click', e => {
            e.preventDefault();
            controlFavourites();
        });
    });
}

reset();