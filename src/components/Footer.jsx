import React from 'react';
import { Link } from 'react-router';

const Footer = () => (
  <footer className="footer">
    <div className="text-center">
      © 2017 <Link to="/" className="footer-text" target="_blank">CoinMarketPedia</Link>
      <a className="footer-text" href="mailto:support@coinmarketpedia.com?Subject=Hello" target="_blank">Contact Us</a>
      <a className="footer-text" href="/sitemap.xml" target="_blank">Sitemap</a>
      <Link className="footer-text" to="/register">Submit Your Organization</Link>
      <Link className="footer-text" to="/about">About</Link>
      <Link className="footer-text" to="/disclaimer">Disclaimer</Link>

    </div>
  </footer>
);

export default Footer;
