import * as dotenv from 'dotenv';
dotenv.config();

console.log("Hello world")
import { getSingleNode } from './examples/singleNodeFlow';
import { listUserInputsForFlow } from './promptNode';

const rootNode = getSingleNode();
const inputs = listUserInputsForFlow(rootNode, new Set())
console.log({userInputs: inputs})

rootNode.run();

