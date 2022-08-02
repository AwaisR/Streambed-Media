import React from "react";
import "./index.css";
function Footer() {
  return (
    <footer className="footer d-flex align-items-center justify-content-between">
      <div className="container mb-0">
        <div className="d-flex align-items-center justify-content-between">
          <div className="rights">
            <p>© All rights Reserved Streambed Media Inc 2020</p>
          </div>

          <div className="rights ">
            <p className="footer-email">support@streambedmedia.com</p>
          </div>

          <div className="quick-links rights d-flex align-items-center">
            <a
              href="https://streambedmedia.com/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>
            <p>|</p>
            <a
              href="https://streambedmedia.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
