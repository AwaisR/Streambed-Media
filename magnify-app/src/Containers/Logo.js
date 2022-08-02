import react from "react";
import "./index.css";
import logo from "../assests/images/logo.svg";
const Logo = () => {
  return (
    <>
      <div className="col-4">
        <header>
          <a href="/" className="logo">
            <img src={logo} a alt="logo" />
          </a>
        </header>
      </div>
    </>
  );
};
export default Logo;
