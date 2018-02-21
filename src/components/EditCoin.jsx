import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const style= {
  palette: {
        accent1Color: 'rgb(0, 84, 129)',
        secondary2color: "rgb(0, 84, 129)"
    }
}
const names = [
  'Payments',
  'Privacy',
  '3rd Generation',
  'Smart Contracts',
  'Gaming',
  'Decentralized Exchange',
  'Infastructure',
  'Invesment',
  'Internet of Things',
  'Open Source',
  'Multi Chain',
  'Lending',
  'Betting',
  'DApp',
  'Medical',
  'Services',
  'Prediction Market',
  'Social Media',
  'Energy',
  'Supply Chain',
  'Other'
];

const EditCoin = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  coin,
  handleChange,
  category,
  values,
}) => (
  <Card className="noteForm" >
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Edit Coin</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="Name"
          name="name"
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
          floatingLabelText="Home Image"
          name="homeImage"
          onChange={onChange}
          value={coin.homeImage}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="White Paper"
          name="paper"
          onChange={onChange}
          value={coin.paper}
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
      <div className="field-line" style={{width:'90%', margin:'auto', display:'left', textAlign:'left'}}>
      <SelectField
          floatingLabelText="Select a Caregory"
          value={values}
          onChange={handleChange}
          multiple={true}

        >
        {names.map((category) => (
          <MenuItem
            key={category}
            insetChildren={true}
            checked={values && values.indexOf(category) > -1}
            value={category}
            primaryText={category}
            style={style}
            />
          ))}

        </SelectField>
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
  handleChange: PropTypes.func.isRequired,
  values: PropTypes.array,
};

export default EditCoin;
