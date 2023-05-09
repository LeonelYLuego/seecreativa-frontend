import NavBar from "@/common/components/navbar";
import "@/common/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar></NavBar>
      <div style={{ margin: "15px 10px"}}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
