# Stock Market View

In this project the goal was to use ES6 and beyond to create a front-end, using React and an MVC architecture, and a back-end, using node.js and express.js.

## Back-End

In the directory `stock-market-be` the back-end of the application can be found. It makes connections to the Alpha Vantage API to retrieve some data about the stock markets.

To launch the application you can use the command `npm run start`.

The stock market information is queried from the Alpha Vantage API with a free account which has a limitation of 5 queries per minute and 500 per day.

Due to this limitations it was built a storage mechanism to spare unnecessary calls which allows us to use the application more freely without the concern of wasting precious free requests which would end fetching repeated information. Another great advantage of storing is the ability to answer to requests more quickly by avoid the HTTP request to Aplha Vantage which increases the efficiency of our server and improves the user experience.

But how can we know that the query is a repeated one? This problem emerged when the user searched for existing stock companies. If a user types `amazon` and another types `amazom` we can say with confidence that both had the same intent for their search and so the response will most likely be the same. To indentify this cases we added to our server a string distance metric, the Jaro-Winkler distance. This allowed us to compare how much two strings are similar and, if the similarity is bigger than a given threshold (if the Jaro-Winkler result is 1 then the two strings are identical) we send the stored response from the previous query.

Regarding the storage, at first we planned to use MongoDB as our database since we wouldn't need a relational database. However our data is small and we only have a server so, for sake of simplicity, we optioned by using the filesystem. Nonetheless we stored all our data in json format for a smoother change to MongoDB when necessary.

## Front-End

In the directory `stock-market-fe` the front-end of the application can be found. It uses a MVC architecture to devide the different components.

The module uses the Webpack module bundler and Babel, a toolchain to convert ES6+ code to a backwards compatible version.

Once in the directory you can execute `npm run start` to launch the application. It will automatically open a page for the app (`http:localhost:8080`)

To be functional it requires that the back-end to be already launched and listening to the address specified in the `config.js` in the backend constant.

## Limitations

At the moment the front-end is hardcoded to retrieve monthly data. It can be changed easly to another type supported by the Alpha Vantage API (which  are weekly or daily) without needing any change in the back-end.

## References

This project was developed to train and learn javascript after asisting the course https://www.udemy.com/course/the-complete-javascript-course/