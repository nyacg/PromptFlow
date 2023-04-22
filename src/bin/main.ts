import * as dotenv from 'dotenv';
import { getSingleNode } from './examples/singleNodeFlow';
// I still need to install dotenv as a dependency -- Danny

dotenv.config();
const OPEN_API_KEY = process.env.OPEN_API_KEY;

const rootNode = getSingleNode();

console.log("Hello world")
