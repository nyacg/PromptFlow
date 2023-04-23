import { Inter } from "next/font/google";
import { FlowView } from "@/components/FlowView";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main
            style={{ width: "100%", height: 1000 }}
            className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
        >
            <FlowView style={{ width: "100%", height: "1000px" }} />
        </main>
    );
}
