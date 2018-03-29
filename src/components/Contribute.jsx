import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';


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


const RegisterCoin = ({
  onSubmit,
  onChange,

  coin,
}) => (
  <Card className="registerForm" style={{boxShadow:'none'}}>
    <form action="/" onSubmit={onSubmit} style={{minHeight:500,height:'auto'}}>
      <div className="field-line">
        <TextField
          floatingLabelText="Summary"
          name="sum"
          hintText="Please share relevant information as you help this ecosystem"
          onChange={onChange}
          value={coin.sum}
          multiLine
          rows={2}
          style={{textAlign:'left', width:'90%'}}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Technology"
          name="technology"
          hintText="The Protocol it uses & Coding Language you use & Block times ..."
          onChange={onChange}
          rows={2}
          value={coin.technology}
          style={{textAlign:'left', width:'90%'}}
          multiLine
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
      <div className="field-line">
        <TextField
          floatingLabelText="Upcoming Events"
          name="upcoming"
          hintText="Mainnet Launch & Smart Contract Implementation"
          onChange={onChange}
          rows={2}
          value={coin.upcoming}
          style={{textAlign:'left', width:'90%'}}
          multiLine
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Other"
          name="other"
          onChange={onChange}
          value={coin.other}
          style={styles.textFld}
        />
      </div>
    </form>
  </Card>
);

RegisterCoin.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  coin: PropTypes.object.isRequired,
};

export default RegisterCoin;
