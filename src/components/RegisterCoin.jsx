import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  textFld: { width: '90%'},
  bigFld: { width: '90%', height:90, textAlign: 'left'},
};
const style = {
  palette: {
    accent1Color: 'rgb(0, 84, 129)',
    secondary2color: 'rgb(0, 84, 129)',
  },
};

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
  'dAPP',
  'Medical',
  'Services',
  'Prediction Market',
  'Social Media',
  'Energy',
  'Supply Chain',
  'Other',
];

const RegisterCoin = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  coin,
  handleChange,
  category,
  values,
}) => (
  <Card className="registerForm">
    <form action="/" onSubmit={onSubmit} style={{minHeight:800,height:'auto'}}>
      <h2 className="noteHeader">Register Your Organization</h2>
      <div className="field-line">
        <TextField
          floatingLabelText="Summary for your organzation"
          name="sum"
          hintText="Min 300 Words"
          onChange={onChange}
          value={coin.sum}
          multiLine
          rows={3}
          style={{textAlign:'left', width:'90%'}}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Technology"
          name="technology"
          hintText="The Protocol it uses & Coding Language you use & Block times ..."
          onChange={onChange}
          rows={3}
          value={coin.technology}
          style={{textAlign:'left', width:'90%'}}
          multiLine
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="History"
          hintText="Date founded & Idea generation & Important events that happened"
          name="history"
          onChange={onChange}
          rows={3}
          value={coin.history}
          style={{textAlign:'left', width:'90%'}}
          multiLine
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Use Cases"
          hintText="Example"
          name="useCase"
          onChange={onChange}
          rows={3}
          value={coin.useCase}
          style={{textAlign:'left', width:'90%'}}
          multiLine
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Value Proposition"
          hintText="Why your organzation exists"
          name="vp"
          onChange={onChange}
          value={coin.vp}
          style={styles.textFld}
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
          floatingLabelText="ICO Price $"
          name="ico"
          onChange={onChange}
          value={coin.ico}
          style={styles.textFld}
        />
      </div>
      <div className="field-line" style={{width:'90%', margin:'auto', display:'left', textAlign:'left'}}>
        <SelectField
          floatingLabelText="Select a Caregory"
          value={values}
          onChange={handleChange}
          multiple
        >
          {names.map((category) => (
            <MenuItem
              key={category}
              insetChildren
              checked={values && values.indexOf(category) > -1}
              value={category}
              primaryText={category}
              style={style}
            />
            ))}
        </SelectField>
      </div>


    </form>
  </Card>
);

RegisterCoin.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  errors: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  coin: PropTypes.object.isRequired,
  values: PropTypes.array,
};

export default RegisterCoin;
