import {elements, buildDts} from './base'

export const favouritesList = array => {
    buildDts(array, elements.favouritesList);
}

export const changeIcon = (isFavourite = document.querySelector('.star__icon use').href.baseVal.includes('dark')) => {
    const iconString = isFavourite ? 'icon-gold-star' : 'icon-dark-star';
    document.querySelector('.star__icon use').setAttribute('href', `img/icons.svg#${iconString}`);
    return isFavourite;
}