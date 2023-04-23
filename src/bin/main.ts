import * as dotenv from "dotenv";
dotenv.config();

console.log("Hello world");
import { getSeasideSingleNode, expertOpinion } from "./examples/singleNodeFlow";
import { listUserInputsForFlow } from "./promptNode";
import { autoGPTFlow } from "./examples/autoGPT";

const flow = autoGPTFlow;
const inputs = flow.getUserInputs();
console.log({ userInputs: inputs });

flow.run();
