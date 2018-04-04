import React from 'react';
import Auth from '../modules/auth.js';
import LoginForm from '../components/LoginForm.jsx';
import PropTypes from 'prop-types';




class LoginPage extends React.Component {

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
        email: '',
        password: '',
      },
      disable: true,
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.verifyCallback = this.verifyCallback.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
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
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        // save the token
        if (!xhr.response.token) {
          this.setState({
            errors: {summary: 'You have entered incorrect credentials!'},
            successMessage: '',
          });
        } else {
          this.setState({
            errors: {},
            successMessage: 'You have successfuly logged in you are being redirected!',
          });
          Auth.authenticateUser(xhr.response.token);
          // change the current URL to /
          setTimeout(() => this.context.router.replace('/'),3000);
        }




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

  verifyCallback () {
    this.setState({disable: false});
  }

  responseGoogle (response) {
     console.log(response);
    //  const token = response.tokenObj.id_token;
     const user = response.w3;
     const username = encodeURIComponent(user.ig);
     const email = encodeURIComponent(user.U3);
     const password = encodeURIComponent(response.tokenObj.access_token);

     const formData = `name=${username}&email=${email}&password=${password}`;

     // create an AJAX request
     const xhr = new XMLHttpRequest ();
     xhr.open('post',  '/auth/login');
     xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //  xhr.setRequestHeader('Authorization', `bearer ${token}`);
     xhr.responseType = 'json';
     xhr.addEventListener('load', () => {
       console.log(xhr.response)
       if (xhr.status === 200) {
         // success

         // change the component-container state
         // save the token

           this.setState({
             errors: {},
             successMessage: 'You have successfuly logged in you are being redirected!',
           });
           Auth.authenticateUser(xhr.response.token);
           // change the current URL to /
            setTimeout(() => this.context.router.replace('/'),3000);


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
   * Render the component.
   */
  render () {
    return (
      <LoginForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
        verifyCallback={this.verifyCallback}
        disable={this.state.disable}
        passGoogle={this.responseGoogle}
      />
    );
  }

}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default LoginPage;
