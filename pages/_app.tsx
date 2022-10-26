import "../styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col items-center max-w-6xl w-full">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
