'use strict';
const express = require('express');
const axios = require('axios');
const storage = require('./storage').functions;
const jwDistance = require('jaro-winkler');

function success(res) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', this.allowedConnections);
}

function error(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Access-Control-Allow-Origin', this.allowedConnections);
}

function checkPrevious(obj, query, acceptP) {
    let maxScore = 0;
    let maxMatch;
    for(const search of Object.keys(obj)) {
        const score = jwDistance(query, search);
        if (score > maxScore) {
            maxScore = score;
            maxMatch = search;
        }
    }
    return maxScore > acceptP ? maxMatch : undefined;
}

class WebServer {
    constructor(hostname, port, allowedConnections, apikey) {
        this.hostname = hostname;
        this.port = port;
        this.allowedConnections = allowedConnections;
        this.apikey = apikey;

        this.favourites = storage.loadFavourites();
        this.searches = storage.loadSearches();
        this.companies = storage.loadCompanies();
    }

    start() {
        this.server = express();

        this.server.get('/', (req, res) => {
            success.call(this, res);
            res.end('Hello World');
        });

        this.server.get('/company', async (req, res) => {
            const symbol = req.query.symbol;
            const timeFrame = req.query.timeFrame;
            let fieldName;
            if (symbol && timeFrame) {
                if (timeFrame === 'MONTHLY') {
                    fieldName = 'Monthly Time Series';
                }
                else if (timeFrame === 'WEEKLY') {
                    fieldName = 'Weekly Time Series';
                }
                else if (timeFrame === 'DAILY') {
                    fieldName = 'Time Series (Daily)'
                }
                try {
                    success.call(this, res);

                    const match = checkPrevious(this.companies, `${symbol}-${timeFrame}`, 0.90);
                    console.log(match);

                    let response;
                    if (match) {
                        response = this.companies[match];
                    } else {
                        let values = await axios(`https://www.alphavantage.co/query?function=TIME_SERIES_${timeFrame}&symbol=${symbol}&apikey=${this.apikey}`)
                        values = values.data[fieldName];
                        response = Object.keys(values).map(x => {
                            const obj = {};
                            obj.t = x;
                            obj.y = values[x]['4. close'];
                            return obj; 
                        });
                        this.companies[`${symbol}-${timeFrame}`] = response;
                        storage.saveCompanies(this.companies);
                    }

                    res.json({
                        results: response
                    });
                } catch (error) {
                    console.log(error);
                }
            }
        })

        this.server.get('/search', async (req, res) => {
            const query = req.query.query.toLowerCase();
            if (query) {
                try {
                    success.call(this, res);

                    const match = checkPrevious(this.searches, query, 0.6);

                    let response;
                    if (match) {
                        response = this.searches[match];
                    } else {
                        response = await axios(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${this.apikey}`);
                        response = response.data.bestMatches.map(i => `${i['1. symbol']}-${i['2. name']}`);
                        this.searches[query] = response;
                        storage.saveSearches(this.searches);
                    }

                    res.json({
                        bestMatches: response
                    });
                } catch (error) {
                    console.log(error);
                }
            } else {
                error.call(this, res);
                res.send();
            }
        });

        this.server.get('/favourites', async (req, res) => {
            if (this.favourites) {
                const response = (this.favourites['user1']) ? this.favourites['user1'] : [];
                success.call(this, res);
                res.json({
                    favourites: response
                });
            } else {
                error.call(this, res);
                res.send();
            }
        });

        this.server.post('/favourites', async (req, res) => {
            let favourites = req.query.favourites;
            favourites = (favourites.length === 0) ? [] : favourites.split(',');
            success.call(this, res);
            res.send();
            this.favourites['user1'] = favourites;
            storage.saveFavourites(this.favourites);
        });

        this.server.listen(this.port, this.hostname, () => console.log(`Example app listening at http://${this.hostname}:${this.port}`));
    }
}

exports.getWebServer = (hostname, port, allowedConnections) => new WebServer(hostname, port, allowedConnections);