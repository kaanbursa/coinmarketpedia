import React, { PropTypes, Component } from 'react';

export default class About extends Component {

  constructor (props, context) {

    super(props, context);

  }





  render () {
    return (
      <main>
        <div>
          <h1 className="homeHeader">About Us</h1>
          <p className="pageDesc" style={{width:'70%',margin:'auto',textAlign:'left'}}>We believe blockchain & cryptocurrencies are going to change the future of finance and the daily life of ordinary people without even their awareness. While this transaction is happening there will be lots of roadblocks on the way which will harm many people as the nature new emerging technologies.
          <br /><br />
First time in the history, there is an opportunity for anyone with an access to Internet to invest in ideas where they believe themselves anywhere around the world without a middleman. We as CoinMarketPedia would like to guide any individual who wants use a cryptocurrency on their own or invest in to it. We aim to bring transparency to the information about organizations behind the cryptocurrencies. It is very important to know what you invest in in order to avoid scams & people who are greedy in this sector, since it hurts the sector as a whole. Furthermore, it is very important for an organization to communicate with masses through a transparent channel. Tools of these needs to be developed a software-first company with its target as the cryptocurrencies market.          <br /><br />
          Coinmarketpedia is working on this idea to help the blockchain & cryptocurrency technology grow safer and faster.</p>
        </div>
      </main>
    )

  }
}
