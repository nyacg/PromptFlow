// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { flowLookup } from "@/pages/[flowId]";

type Data = {
    name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { flowId, inputs } = req.body;
    const flow = flowLookup[flowId];

    const flowResponse = await flow.run();
    console.log("Flow response", flowResponse);
    res.status(200).json({ flowId, inputs, flowResponse });
}
