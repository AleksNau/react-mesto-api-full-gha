import React from "react";

const Footer = () => {
  return (
    <footer className="footer">
      <p className="footer__trademark">© {new Date().getFullYear()} Mesto Russia</p>
    </footer>
  );
};

export default Footer;
