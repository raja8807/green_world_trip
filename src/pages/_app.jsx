import "../styles/globals.scss";
import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router, { useRouter } from "next/router";
import Head from "next/head";


import { ToastContainer } from "react-toastify";
import Layout from "@/components/layout/layout";
import { FONTS } from "@/styles/fonts";
import LoadingScreen from "@/components/ui/loading_screen/loading_screen";


export default function App({ Component, pageProps }) {
  useEffect(() => {
    // ----------- AOS ----------------------
    Aos.init({
      duration: 1000,
      once: false,
    });

    // ----------- Progress ----------------------

    Router.events.on("routeChangeStart", (...params) => {
      NProgress.start(params);
    });
    Router.events.on("routeChangeComplete", NProgress.done);
    Router.events.on("routeChangeError", NProgress.done);
    return () => {
      Router.events.off("routeChangeStart", NProgress.start);
      Router.events.off("routeChangeComplete", NProgress.done);
      Router.events.off("routeChangeError", NProgress.done);
    };
  }, []);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1400);
  }, []);

  const router = useRouter();
  const isHome = router.pathname === "/";

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Green World Trip | Home</title>
      </Head>

      <main className={FONTS.font1}>
        
        <Layout>
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" />
        </Layout>

      </main>

    </>
  );
}
