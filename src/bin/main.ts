import * as dotenv from 'dotenv';
dotenv.config();

console.log("Hello world")
import { getSingleNode } from './examples/singleNodeFlow';

const rootNode = getSingleNode();
rootNode.run();

