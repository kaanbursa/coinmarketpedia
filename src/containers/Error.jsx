import React from 'react';
import PropTypes from 'prop-types';



class ErrorPage extends React.Component {



  /**
   * Render the component.
   */
  render () {
    return (

      <h1 class="homeHeader"> Oppss! Page not found!</h1>
    );
  }

}

ErrorPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default ErrorPage;
