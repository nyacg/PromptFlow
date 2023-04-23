import FlowGraph from "@/components/FlowGraph";
import { useState, ChangeEvent, FormEvent } from "react";
import { expertOpinion } from "../../src/bin/examples/singleNodeFlow";
import { autoGPTFlow } from "../../src/bin/examples/autoGPT";
import { useRouter } from "next/router";
import { Flow } from "../../src/nodes/flow";

const flowLookup = {
    "1": expertOpinion(),
    "2": autoGPTFlow,
};

const FlowForm = ({ flow }: { flow: Flow }) => {
    const [formValues, setFormValues] = useState({});
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Submitting request with", formValues);
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
    const router = useRouter();
    const { flowId } = router.query;
    const flow = flowLookup[flowId];

    if (!flow) {
        console.error("NO FLOW FOUND FOR ID", flowId);
        return <p>No flow found with id: {flowId}</p>;
    }

    console.log("Using flow", flow);
    return (
        <div>
            <button
                style={{ position: "absolute", top: 0, left: 0, zIndex: 100000 }}
                onClick={() => setToggleView(!toggleView)}
            >
                {toggleView ? "Show Graph" : "Show Form "}
            </button>
            {toggleView && <FlowForm flow={flow} />}
            <div>{!toggleView && <FlowGraph flow={flow} />}</div>
        </div>
    );
};

export default HomePage;
