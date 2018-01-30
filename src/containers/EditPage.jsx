import React from 'react';
import Auth from '../modules/auth.js';
import EditCoin from '../components/EditCoin.jsx';
import PropTypes from 'prop-types';



class EditPage extends React.Component {

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
      coin: {},
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  componentDidMount () {
    const req = new XMLHttpRequest();
    req.open('GET', `/admin/edit/${this.props.routeParams.name}`, true);
    req.responseType = 'json';
    req.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    req.setRequestHeader('Content-type', 'application/json');
    req.addEventListener('load', () => {
      if ( req.status === 200){


      console.log(req.response)
      let coin = req.response;

      // if(req.response[0].htmlcode === null){
      //    jsonData = '{"entityMap":{},"blocks":[{"key":"ftlv9","text":"No Information Available","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}'
      // } else {
      //    jsonData = req.response[0].htmlcode;
      //    this.state.render = true;
      // }
      // const data = req.response[1];
      // data.market_cap_usd = numberWithCommas(data.market_cap_usd);
      // data["24h_volume_usd"] = numberWithCommas(data["24h_volume_usd"]);
      // let pctChange = data.percent_change_24h
      // let raw = null;
      // try {
      //   raw = JSON.parse(jsonData);
      // } catch (e) {
      //   // You can read e for more info
      //   // Let's assume the error is that we already have parsed the payload
      //   // So just return that
      //   raw = jsonData;
      // }
      // const contentState = convertFromRaw(raw);
      // const editorState = EditorState.createWithContent(contentState);
      this.setState({coin : coin});
    } else {
      this.context.router.replace('/');
    }
    });
    req.send();
  };

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm (event) {

    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.coin.coinname);
    const ticker = encodeURIComponent(this.state.coin.ticker);
    const image = encodeURIComponent(this.state.coin.image);
    const videoId = encodeURIComponent(this.state.coin.videoId);
    const formData = `name=${name}&ticker=${ticker}&image=${image}&videoId=${videoId}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/admin/edit/${this.props.routeParams.name}`);
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

        // change the current URL to /
        this.window.reload();
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
    const coin = this.state.coin;
    coin[field] = event.target.value;

    this.setState({
      coin,
    });
  }

  /**
   * Render the component.
   */
  render () {
    console.log(this.state.coin)
    if (this.state.coin === undefined){
      return true
    } else {
      return (
        <EditCoin
          onSubmit={this.processForm}
          onChange={this.changeUser}
          errors={this.state.errors}
          successMessage={this.state.successMessage}
          coin={this.state.coin}
        />
      );
    }
  }
}

EditPage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default EditPage;
