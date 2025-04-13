import React from "react";
import Head from "next/head";

import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div>
      <Head>
        <title>Flicktix</title>
      </Head>
      <header className="h-full relative">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      </header>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
