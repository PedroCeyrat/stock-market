import axios from 'axios';
import {proxy, backend} from '../config';

export default class Company {
    constructor(symbol, name) {
        this.symbol = symbol;
        this.name = name;
        this.fullname = `${symbol}-${name}`;
        this.endpoint = '/company';
    }

    async getWikipediaUrl() {
        try {
            const info = await axios(`${proxy}https://en.wikipedia.org/w/api.php?action=query&prop=description&list=search&srsearch=${this.name}&format=json`);
            const pageid = info.data.query.search[0].pageid;
            const pageinfo = await axios(`${proxy}https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${pageid}&inprop=url&format=json`);
            return pageinfo.data.query.pages[pageid].fullurl;
        } catch (error) {
            alert(error);
        }
    }

    async getData(timeFrame) {
        try {
            const results = await axios(`${backend}${this.endpoint}?symbol=${this.symbol}&timeFrame=${timeFrame}`)
            return results.data.results;
        } catch (error) {
            alert(error);
        }
    }
}