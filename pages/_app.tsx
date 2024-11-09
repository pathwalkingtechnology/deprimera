import "@/styles/globals.css";

interface MyAppProps {
  Component: React.FC;
  pageProps: {
    [key: string]: unknown; // Cambia 'any' a 'unknown'
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return (
    <div className="container">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp
