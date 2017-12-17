import React, { Component } from 'react';
import { VideosList, Footer } from 'components';
import { API } from '../config';
import Anime from 'react-anime';

export default class Home extends Component {

  constructor (props) {
    super(props);
    // Set the videoList to empty array
    this.state = { videosList: [] };
  }


  render () {
    const { videosList } = this.state;
    return (
      <main>
        <div className="homePage">
          <h1 className="homeHeader">Welcome to HKS Metals</h1>
          <div className="anime">
            <Anime
              asing="easeOutElastic"
               duration={1000}
               direction="alternate"
               loop= {true}
               delay={(el, index) => index * 250}
               translateX="13rem"
               scale={[.75, .9]}
            >
              <div className="blue" />
              <div className="green" />
              <div className="red" />
            </Anime>
          </div>
        </div>

        <Footer />
      </main>
    );
  }
}
