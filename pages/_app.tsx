import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store/store";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>
        {`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}
      </style>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ClerkProvider {...pageProps}>
            <Component {...pageProps} />
          </ClerkProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
