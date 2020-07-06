import React from 'react';
import ReactDOM from 'react-dom';

export const elements = {
    companyTitle: document.querySelector('.company .title .heading-2'),
    companyChart: document.querySelector('.company .chart'),
    companyInfo: document.querySelector('.company .info'),
    searchCompaniesList: document.querySelector('.search #companies-list'),
    searchField: document.querySelector('.search .search__field'),
    searchBtn: document.querySelector('.search .search__btn'),
    stockMarketsList: document.querySelector('.stock-markets .list'),
    favouritesList: document.querySelector('.favourites .list'),
    starIcon: document.querySelector('.favourites .star__icon')
}

function buildList(type) {
    return function(array, location) {
        if (type === 'dt') {
            ReactDOM.render(array.map(i => <dt key={i}>{i}</dt>), location);
        }
        else if (type === 'option') {
            ReactDOM.render(array.map(i => <option key={i} value={i}/>), location);
        }
    }
}

export const renderLoader = location => {
    const element = <div className="loader">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    ReactDOM.render(element, location);
}

export const buildDts = buildList('dt');
export const buildOptions = buildList('option');