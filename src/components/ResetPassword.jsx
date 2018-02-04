import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';



const ResetPassword = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user,
  validate,
  passMatch,
}) => (
  <Card className="noteForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Change Password</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors && <p className="error-message">{errors}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="New Password"
          name="password"
          onChange={onChange}
          type='password'
          value={user.password}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Confirm Password"
          name="confirmPassword"
          onChange={validate}
          type='password'
          value={user.confirmPassword}
          errorText={passMatch}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Submit" primary style={{marginBottom:'20px'}}/>
      </div>
    </form>
  </Card>
);

ResetPassword.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  validate: PropTypes.func.isRequired,
  passMatch: PropTypes.string.isRequired,
};

export default ResetPassword;
