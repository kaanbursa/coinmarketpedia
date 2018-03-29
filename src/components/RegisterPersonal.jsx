import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';


const RegisterPersonal = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user,
}) => (
  <Card className="registerForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Organzation Information</h2>
      <div className="field-line">
        <TextField
          floatingLabelText="Organzation Name"
          name="organization"
          onChange={onChange}
          value={user.organization}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Coin Name"
          name="coinname"
          onChange={onChange}
          value={user.coinname}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Ticker"
          name="ticker"
          onChange={onChange}
          value={user.ticker}
        />
      </div>
    </form>
  </Card>
);
RegisterPersonal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default RegisterPersonal;
