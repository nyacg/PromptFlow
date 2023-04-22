import * as dotenv from 'dotenv';
// I still need to install dotenv as a dependency -- Danny

dotenv.config();
const OPEN_API_KEY = process.env.OPEN_API_KEY;

const rootNode = getInitialNode();

console.log("Hello world")
