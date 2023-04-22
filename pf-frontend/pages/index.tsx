import { useState, ChangeEvent, FormEvent } from 'react';

interface InputSpec {
  name: string;
  description?: string;
}

interface FlowSpec {
  title: string;
  description: string;
  inputs: InputSpec[];
}

const landingPageFlowSpec: FlowSpec = {
  title: 'Landing Page Generator',
  description:
    "Give us a few details about your product and we'll generate a simple email collection landing page for you",
  inputs: [
    {
      name: 'Product name',
    },
    {
      name: 'Industry',
    },
    {
      name: 'Description',
      description:
        'A brief description about your offering, feel free to use bullet points',
    },
  ],
};

const LandingPageForm = () => {
  const [formValues, setFormValues] = useState({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formValues);
  };

  return (
    <div>
      <h1>{landingPageFlowSpec.title}</h1>
      <p>{landingPageFlowSpec.description}</p>
      <form onSubmit={handleSubmit}>
        {landingPageFlowSpec.inputs.map((input, index) => (
          <div key={index}>
            <label htmlFor={input.name}>{input.name}</label>
            <input
              type="text"
              id={input.name}
              name={input.name}
              placeholder={input.description}
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
  return (
    <div>
      <LandingPageForm />
    </div>
  );
};

export default HomePage;

