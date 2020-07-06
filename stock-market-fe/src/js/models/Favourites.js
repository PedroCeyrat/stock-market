import axios from 'axios';
import {backend} from '../config';

export default class Favourites {
    constructor(){
        this.endpoint = '/favourites';
        this.list = [];
    }

    async initList() {
        try{
            const response = await axios(`${backend}${this.endpoint}`);
            this.list = response.data.favourites;
        } catch (error) {
            console.log(error);
        }
    }

    add(name) {
        this.list.push(name);
    }

    remove(name) {
        this.list = this.list.filter(i => i !== name);
    }

    async update() {
        try {
            console.log(this.list);
            axios.post(`${backend}${this.endpoint}?favourites=${this.list}`);
        } catch (error) {
            console.log(error);
        }
    }
}