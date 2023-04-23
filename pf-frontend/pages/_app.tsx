import "@/styles/globals.css";
import "@/styles/styles.css";

import type { AppProps } from "next/app";
import "./overview.css";
import "reactflow/dist/style.css";

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
