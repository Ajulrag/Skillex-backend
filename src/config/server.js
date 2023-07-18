const dotenv = require('dotenv');
dotenv.config({path: '.env'});
const {createServer} = require('http');
const app = require('../app.js');
const {dbConnection} = require('./db.js');

dbConnection().then(() => {
  const server = createServer(app);
  const port = process.env.PORT || 3000;
  server.listen(port, () => console.log(`listening on ${port}`));
}).catch(console.log);
