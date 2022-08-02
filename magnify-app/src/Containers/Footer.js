import react from "react";
const Footer = () => {
  return (
    <>
      <footer>
        <div className="row">
          <div className="col help-wrap ">
            <span className="need-help">
              Need Help? Contact support@streambedmedia.com
            </span>
          </div>
          <div className="col need-inner">
            <ul className="footer-links">
              <li>
                <a href="https://streambedmedia.com/terms">Terms of Service </a>
              </li>
              <li>
                <a href="https://streambedmedia.com/privacy">Privacy Policy</a>
              </li>
            </ul>
            <span>
              © All Rights Reserved,
              <a href="https://streambedmedia.com/index"> Streambed Media</a>{" "}
              Inc 2020
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};
export default Footer;
