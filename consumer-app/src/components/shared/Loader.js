import React from "react";
import _loader from "../../assets/images/content-loader.svg";
function Loader() {
  return (
    <div>
      <div className="img-graph-loader" id="loader">
        {" "}
        <img src={_loader} alt="loader" />{" "}
      </div>
    </div>
  );
}

export default Loader;
