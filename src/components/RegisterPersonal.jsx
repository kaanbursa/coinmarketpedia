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
      <h2 className="noteHeader">Personal Information</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="Your Name"
          name="username"
          onChange={onChange}
          value={user.username}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Email"
          name="email"
          onChange={onChange}
          value={user.email}
        />
      </div>
    </form>
  </Card>
);
RegisterPersonal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default RegisterPersonal;
