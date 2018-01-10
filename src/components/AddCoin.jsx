import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';



const AddCoin = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  coin,
}) => (
  <Card className="noteForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Add New Coin</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Coin Name"
          name="coinname"
          onChange={onChange}
          value={coin.coinname}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Ticker"
          name="ticker"
          onChange={onChange}
          value={coin.ticker}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Add Coin" primary />
      </div>
    </form>
  </Card>
);

AddCoin.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  coin: PropTypes.object.isRequired,
};

export default AddCoin;
