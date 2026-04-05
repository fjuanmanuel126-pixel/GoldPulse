// pages/_app.tsx
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/branding/theme.css";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
