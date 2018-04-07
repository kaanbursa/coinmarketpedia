import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';
import { GoogleLogin } from 'react-google-login';



const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user,
  disable,
  verifyCallback,
  passGoogle,
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
      <div className="recapca">
        <Recaptcha
        sitekey="6LfnnEAUAAAAAGNV4hfoE3kz4DAP1NqgZW2ZetFu"
        render="explicit"
        verifyCallback={verifyCallback}
        />
      </div>

      <div className="button-line" style={{width:'100%',margin:'auto',marginTop:20}}>
        <RaisedButton type="submit" disabled={disable} label="Log in" primary />
        <p className="summary"> OR </p>
      </div>
      <div className="googleLogin">
        <GoogleLogin
          clientId="168772174730-5qmsi0vebtocudru00c6njepdu5pnec6.apps.googleusercontent.com"
          buttonText={<div style={{display:'inline-flex'}}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2000px-Google_%22G%22_Logo.svg.png" style={{width:20,height:20,marginTop:6,marginRight:5}}/><p style={{lineHeight:2.3}}>Login In With Google</p></div>}
          onSuccess={passGoogle}
          onFailure={passGoogle}
          className="googleButton"
        />
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
  passGoogle: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  disable: PropTypes.bool.isRequired,
};

export default LoginForm;
