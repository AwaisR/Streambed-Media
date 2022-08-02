import React from "react";
import Header from "./shared/header/Header";
import Footer from "./shared/footer/index";
import Tour from "./Tour";
function Layout(props) {
  return (
    <div className="main-content-outer">
      <Header hide={false} />
      <div className="body-content-wrapper">{props.children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
