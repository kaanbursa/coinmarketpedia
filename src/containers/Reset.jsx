import React from 'react';
import Auth from '../modules/auth.js';
import ResetPassword from '../components/ResetPassword.jsx';
import PropTypes from 'prop-types';



class ResetPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor (props, context) {
    super(props, context);

    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        password: '',
        confirmPassword: '',
      },
      passMatch: '',
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.validate = this.validate.bind(this);
    this.isConfirmedPassword = this.isConfirmedPassword.bind(this);
  }

  componentDidMount () {
    const req = new XMLHttpRequest();
    req.open('GET', `/api/reset/${this.props.routeParams.token}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if (req.status === 200) {

      } else {
        const errors = req.response.errors ? req.response.errors : {};

        this.setState({
          errors,
        });
      }

    });
    req.send();

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
    const password = encodeURIComponent(this.state.user.password);
    const formData = `password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/reset/${this.props.routeParams.token}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {},
        });
        // save the token
        const success = xhr.response.success ? xhr.response.success : {};
        // change the current URL to /
        setTimeout(() => this.context.router.replace('/login'),3000);
      } else {
        // failure
        // change the component state
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors,
        });
      }
    });
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser (event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user,
    });
  }

  handlePasswordInput (event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user,
    });
    const self = this;
    window.setTimeout(() => {
      if (self.state.user.confirmPassword && self.state.user.confirmPassword.length) {
        self.isConfirmedPassword(self.state.user.confirmPassword);
        self.validate(self.state.user.confirmPassword);
      };
    });
  }

  isConfirmedPassword (value) {
    return (value === this.state.user.password);
  }

  validate (value) {
    if (this.isConfirmedPassword(value)) {
      this.setState({
        valid: true,
        passMatch: '',
      });
    } else {
      this.setState({
        valid: false,
        passMatch: 'Password do not match',
      });
    }
  }

  /**
   * Render the component.
   */
  render () {
    return (
      <ResetPassword
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
        validate={this.handlePasswordInput}
        passMatch={this.state.passMatch}
      />
    );
  }

}

ResetPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default ResetPage;
