import React from 'react';
import SignUpForm from '../components/SignUpForm.jsx';

import PropTypes from 'prop-types';
import validator from 'validator';


class SignUpPage extends React.Component {

  /**
   * Class constructor.
   */
  constructor (props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      successMessage: '',
      user: {
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
      },
      passMatch: '',
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.isConfirmedPassword = this.isConfirmedPassword.bind(this);
    this.validate = this.validate.bind(this);

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

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm (event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `name=${name}&email=${email}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest ();
    xhr.open('post',  '/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
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
        const successMessage = xhr.response.message
        console.log(xhr.response.message)
        this.setState({successMessage})
        Auth.authenticateUser(xhr.response.token);
        // make a redirect
        setTimeout(function(){
         return this.context.router.goBack();
          }.bind(this),3000);
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

  handlePasswordInput (event) {
    console.log(event)
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

      this.setState({
         user
      });
      var self = this;
      window.setTimeout(function(){

        if (self.state.user.confirmPassword && self.state.user.confirmPassword.length) {
          self.isConfirmedPassword(self.state.user.confirmPassword);
          self.validate(self.state.user.confirmPassword)
      }

    });

}
isConfirmedPassword(value) {
      console.log(value,this.state.user.password,value===this.state.user.password);
       return (value === this.state.user.password)

}
validate (value) {
        if (this.isConfirmedPassword(value)) {
            this.setState({
                valid: true,
                passMatch: ''
            });
        } else {
            this.setState({
                valid: false,
                passMatch: 'Password do not match'
            });
        }
    }

  /**
   * Render the component.
   */
  render () {
    return (
      <SignUpForm
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
SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default SignUpPage;
