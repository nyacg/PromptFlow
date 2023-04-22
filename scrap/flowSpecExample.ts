interface InputSpec {
    name: string
    description?: string
}


interface FlowSpec {
    title: string
    description: string
    inputs: InputSpec[]
}

const landingPageFlowSpec: FlowSpec = {
    title: "Landing Page Generator",
    description: "Give us a few details about your product and we'll generate a simple email collection landing page for you",
    inputs: [
        {
            name: "Product name",
        },
        {
            name: "Industry",
        },
        {
            name: "Description",
            description: "A brief description about your offering, feel free to use bullet points"
        }
    ]
}