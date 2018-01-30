import React from 'react';
import  { RegisterCoin, RegisterPersonal } from 'components';
import PropTypes from 'prop-types';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Recaptcha from 'react-recaptcha';
import Auth from '../modules/auth.js';
import { Link } from 'react-router';


class RegisterPage extends React.Component {


  constructor (props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      successMessage: '',
      coin: {
        name: '',
        ticker: '',
        history: '',
        technology: '',
        vp: '',
        upcoming: '',
        keyPeople: '',
      },
      user: {
        username:'',
        email: '',
      },
      finished: false,
      stepIndex: 0,
      disabled: true,
    };

    this.updateUser = this.updateUser.bind(this);
    this.processForm = this.processForm.bind(this);
    this.updateCoin = this.updateCoin.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.callback = this.callback.bind(this);
  }

  /**
   * Change the coin object.
   *
   * @param {object} event - the JavaScript event object
   */
  updateCoin (event) {
    const field = event.target.name;
    const coin = this.state.coin;
    coin[field] = event.target.value;
    this.setState({
      coin,
    });
  }

  updateUser (event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;
    this.setState({
      user,
    });
  }
  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm (event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const username = encodeURIComponent(this.state.user.username);
    const email = encodeURIComponent(this.state.user.email);
    const name = encodeURIComponent(this.state.coin.name);
    const ticker = encodeURIComponent(this.state.coin.ticker);
    const history = encodeURIComponent(this.state.coin.history);
    const technology = encodeURIComponent(this.state.coin.technology);
    const vp = encodeURIComponent(this.state.coin.vp);
    const upcoming = encodeURIComponent(this.state.coin.upcoming);
    const keyPeople = encodeURIComponent(this.state.coin.keyPeople);
    const formData = `username=${username}&email=${email}&name=${name}&ticker=${ticker}&history=${history}&technology=${technology}&vp=${vp}&upcoming=${upcoming}&keyPeople=${keyPeople}`;
    // create an AJAX request
    const xhr = new XMLHttpRequest ();
    xhr.open('POST','/api/register', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {},
        });

        // set a message
        localStorage.setItem('successMessage', xhr.response.message);

        // make a redirect
        this.context.router.replace('/');
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors,
        });
      }
    });
    xhr.send(formData);
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  callback () {
    this.setState({disabled :  false});
    return true;
  }

  getStepContent (stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <RegisterPersonal
          onSubmit={this.processForm}
          onChange={this.updateUser}
          errors={this.state.errors}
          user={this.state.user}
          successMessage={this.state.successMessage}
          style={{width:1000}}
          />);
      case 1:
        return (
          <RegisterCoin
          onSubmit={this.processForm}
          onChange={this.updateCoin}
          errors={this.state.errors}
          coin={this.state.coin}
          successMessage={this.state.successMessage}
          style={{width:1000}}
          />);
      case 2:
        return (
          <Recaptcha
          sitekey="6LfnnEAUAAAAAGNV4hfoE3kz4DAP1NqgZW2ZetFu"
          render="explicit"
          className="button-line"
          onloadCallback={this.callback}
          />);
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  /**
   * Render the component.
   */
  render () {
    const styles = {
      textFld: { width: 1000},
      bigFld: { width: 1000, height:90},
    };
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px'};

    return (

      <div style={{width: '90%',  margin: 'auto', height:1300}}>
      {Auth.isUserAuthenticated() ? (
        <div>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>Personal</StepLabel>
          </Step>
          <Step>
            <StepLabel>Your Coin & Token Info </StepLabel>
          </Step>
          <Step>
            <StepLabel>Final Step</StepLabel>
          </Step>
        </Stepper>
        <div style={contentStyle}>
          {finished ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, finished: false});
                }}
              >
                Click here
              </a> to reset the example.
            </p>
          ) : (
            <div>
              <div>{this.getStepContent(stepIndex)}</div>
              <div style={{marginTop: 12}} className="button-line">
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onClick={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 2 ? 'Finish' : 'Next'}
                  primary={true}
                  onClick={stepIndex === 2 ? this.processForm : this.handleNext}
                  disabled={stepIndex === 2 ? this.state.disabled : !this.state.disabled}
                />
              </div>
            </div>
          )}
        </div>
        </div>
      ) : (
        <div>
          <p className="pageDesc">You need to  <Link to={`/signup`}>
            sign up!
          </Link></p>
        </div>
      )}
      </div>
    );
  }

}
RegisterPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default RegisterPage;
