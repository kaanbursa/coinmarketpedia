import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';



const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user,
  disable,
  verifyCallback,
}) => (
  <Card className="container">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Login</h2>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Email"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>

      <div className="field-line">
        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>
      <div className="button-line" style={{margin:'auto'}}>
        <Recaptcha
        sitekey="6LfnnEAUAAAAAGNV4hfoE3kz4DAP1NqgZW2ZetFu"
        render="explicit"
        verifyCallback={verifyCallback}
        />
      </div>

      <div className="button-line">
        <RaisedButton type="submit" disabled={disable} label="Log in" primary />
      </div>

      <CardText>Don't have an account? <Link to={'/signup'}>Create one</Link>.</CardText>
      <CardText><Link to={'/forgot'}>Forgot Your Password?</Link></CardText>
    </form>
  </Card>
);

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  verifyCallback: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  disable: PropTypes.bool.isRequired,
};

export default LoginForm;
