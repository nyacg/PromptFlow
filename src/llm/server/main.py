import os
from collections import defaultdict

import lmql
import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()


class Item(BaseModel):
    script: str


class OutputSaver:
    def __init__(self):
        self.outputs = defaultdict(list)


    def add_decoder_state(*args, **kwargs):
        pass

    def add_interpreter_head_state(self, variable, head, prompt, where, trace, is_valid, is_final, mask, num_tokens,
                                   program_variables):

        for variable_name, variable_value in program_variables.variable_values.items():
            if variable_value == "":
                self.outputs[variable_name].append("")
            else:
                self.outputs[variable_name][-1] = variable_value.strip()

    def add_compiler_output(self, code):
        pass


@app.post("/run")
async def create_item(item: Item):
    print("Got request: \n", item.script)
    output_saver = OutputSaver()
    response = await lmql.run(item.script, output_writer=output_saver)
    if response is None:
        raise RuntimeError()
    print("Response:\n", response)
    return output_saver.outputs


if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
