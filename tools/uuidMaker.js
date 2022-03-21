/* ES6 module syntax */
// import { v4 as uuidv4 } from 'uuid';
// uuidv4();

/* using CommonJs syntax */
const { v4: uuidv4 } = require('uuid');

module.exports = uuidv4();

