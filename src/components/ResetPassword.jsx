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
}) => (
  <Card className="noteForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Change Password</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="New Password"
          name="password"
          onChange={onChange}
          value={user.password}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" label="Submit" primary />
      </div>
    </form>
  </Card>
);

ResetPassword.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
};

export default ResetPassword;
