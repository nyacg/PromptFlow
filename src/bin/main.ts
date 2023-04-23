import * as dotenv from "dotenv";
dotenv.config();

console.log("Hello world");
import { getSeasideSingleNode, expertOpinion } from "./examples/singleNodeFlow";
import { listUserInputsForFlow } from "./promptNode";

const rootNode = expertOpinion();
const inputs = listUserInputsForFlow(rootNode, new Set());
console.log({ userInputs: inputs });

rootNode.run(new Set());
