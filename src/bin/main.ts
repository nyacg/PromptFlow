import * as dotenv from "dotenv";
dotenv.config();

console.log("Hello world");
import { getSeasideSingleNode } from "./examples/singleNodeFlow";
import { listUserInputsForFlow } from "./promptNode";

const rootNode = getSeasideSingleNode();
const inputs = listUserInputsForFlow(rootNode, new Set());
console.log({ userInputs: inputs });

rootNode.run();
