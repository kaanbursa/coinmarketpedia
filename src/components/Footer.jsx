import React from 'react';
import { Link } from 'react-router';

const Footer = () => (
  <footer className="footer">
    <div className="text-center">
      © 2017 <Link to="/" className="footer-text" target="_blank">CoinMarketPedia</Link>
      <a className="footer-text" href="mailto:kaan@coinmarketpedia.com?Subject=Hello" target="_blank">Contact Us</a>
      <Link className="footer-text" to='/register'>Register Your Coin</Link> 

    </div>
  </footer>
);

export default Footer;
