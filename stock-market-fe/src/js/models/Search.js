import axios from 'axios';
import {backend} from '../config';

export default class Search {
    constructor(query){
        this.query = query;
        this.endpoint = '/search';
    }

    async searchCompanies() {
        try {
            const res = await axios(`${backend}${this.endpoint}?query=${this.query}`);
            this.results = res.data.bestMatches;
        } catch (error) {
            alert(error);
        }
    }
}