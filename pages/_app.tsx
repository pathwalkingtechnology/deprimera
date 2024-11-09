import "@/styles/globals.css";

interface MyAppProps {
  Component: React.FC;
  pageProps: {
    [key: string]: any;
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
