import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';

const styles = {
    textFld: { width: 1000},
    bigFld: { width: 1000, height:90, textAlign: 'left'}
};

const RegisterCoin = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  coin,
}) => (
  <Card className="registerForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Register Your Coin</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="Coin Name"
          hintText="Ethereum"
          name="name"
          onChange={onChange}
          value={coin.name}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Ticker"
          hintText="ETH"
          name="ticker"
          onChange={onChange}
          value={coin.ticker}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText='Value Proposition'
          hintText="'To make the world decentralized'"
          name="vp"
          onChange={onChange}
          value={coin.vp}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText='ICO Price'
          name="ico"
          onChange={onChange}
          value={coin.ico}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Summary of Your Coin"
          name="summary"
          hintText="Min 300 Words"
          onChange={onChange}
          value={coin.summary}
          multiLine={true}
          style={{textAlign:'left', width:1000}}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Technology"
          name="technology"
          hintText="The Protocol it uses"
          onChange={onChange}
          value={coin.technology}
          style={{textAlign:'left', width:1000}}
          multiLine={true}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Key People"
          name="keyPeople"
          onChange={onChange}
          value={coin.keyPeople}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="History"
          hintText="Date founded & Idea generation & Important events that happened"
          name="history"
          onChange={onChange}
          value={coin.history}
          style={{textAlign:'left', width:1000}}
          multiLine={true}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Upcoming Events"
          name="upcoming"
          hintText="Mainnet Launch & Smart Contract Implementation"
          onChange={onChange}
          value={coin.upcoming}
          style={{textAlign:'left', width:1000}}
          multiLine={true}
        />
      </div>
    </form>
  </Card>
);

RegisterCoin.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  coin: PropTypes.object.isRequired,
};

export default RegisterCoin;
