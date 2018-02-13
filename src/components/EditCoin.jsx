import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';



const EditCoin = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  coin,
}) => (
  <Card className="noteForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Edit Coin</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="Name"
          name="coinname"
          onChange={onChange}
          value={coin.name}
        />
      </div>
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
      <div className="field-line">
        <TextField
          floatingLabelText="Github"
          name="github"
          onChange={onChange}
          value={coin.github}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="ICO Price"
          name="icoPrice"
          onChange={onChange}
          value={coin.icoPrice}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Image"
          name="image"
          onChange={onChange}
          value={coin.image}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="VideoId"
          name="videoId"
          onChange={onChange}
          value={coin.videoId}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Website Link"
          name="website"
          onChange={onChange}
          value={coin.website}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="@ Tweeter Username"
          name="tweeter"
          onChange={onChange}
          value={coin.tweeter}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Edit Coin" primary />
      </div>
    </form>
  </Card>
);

EditCoin.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  coin: PropTypes.object.isRequired,
};

export default EditCoin;
