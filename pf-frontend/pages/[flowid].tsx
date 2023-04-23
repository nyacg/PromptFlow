import FlowGraph from "@/components/FlowGraph";
import { useState, ChangeEvent, FormEvent } from "react";
import { expertOpinion } from "../../src/bin/examples/singleNodeFlow";
import { autoGPTFlow } from "../../src/bin/examples/autoGPT";
import { useRouter } from 'next/router'

const FlowLookup = {
  "1": expertOpinion(),
  "2": autoGPTFlow,
};

const FlowForm = () => {
    const [formValues, setFormValues] = useState({});
    const router = useRouter()
    const { flowid } = router.query
    const flow = FlowLookup[flowid];
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Request for %n", {flowid}, formValues);
    };

    return (
        <div>
            <h1>{flow.title}</h1>
            <p>{flow.description}</p>
            <form onSubmit={handleSubmit}>
                {flow.getUserInputs().map((input, index) => (
                    <div key={index}>
                        <label htmlFor={input.name}>{input.name}</label>
                        <input
                            type="text"
                            id={input.name}
                            name={input.name}
                            placeholder={input.value}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};


const HomePage = () => {
    const [toggleView, setToggleView] = useState(false);
    return (
        <div>
            <button onClick={() => setToggleView(!toggleView)}>{toggleView ? "Show Graph" : "Show Form "}</button>
            {toggleView && <FlowForm />}
            <div>{!toggleView && <FlowGraph />}</div>
        </div>
    );
};

export default HomePage;
