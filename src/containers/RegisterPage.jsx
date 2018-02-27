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
import FormData from 'form-data';
import axios from 'axios';
import FontIcon from 'material-ui/FontIcon';
import DatePicker from 'react-date-picker';
import TextField from 'material-ui/TextField';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


class RegisterPage extends React.Component {


  constructor (props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: '',
      successMessage: '',
      coin: {
        name: '',
        ticker: '',
        history: '',
        technology: '',
        sum: '',
        vp: '',
        upcoming: '',
        keyPeople: '',
        ico: '',

      },
      values: [],
      user: {
        username:'',
        email: '',
      },
      finished: false,
      stepIndex: 0,
      disabled: true,
      picture: ['http://socialmediaweek.org/wp-content/blogs.dir/1/files/2015/02/no-image1.png'],
      file: {},
      upcomingEvent: '',
      date: new Date(),
      table: [],
      selectedRows: 1,
    };

    this.updateUser = this.updateUser.bind(this);
    this.processForm = this.processForm.bind(this);
    this.updateCoin = this.updateCoin.bind(this);
    this.getStepContent = this.getStepContent.bind(this);
    this.callback = this.callback.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.disabled = this.disabled.bind(this);
    this.imageUpload = this.imageUpload.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.onEventChange = this.onEventChange.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);

  }

  onDateChange = date => this.setState({date})
  onEventChange (event) {
      const upcomingEvent = event.target.value;
        this.setState({
           upcomingEvent
        });
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

  handleChange = (event, index, values) => this.setState({values});

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
    const category = encodeURIComponent(this.state.coin.category);
    const summary = encodeURIComponent(this.state.coin.sum);
    const ticker = encodeURIComponent(this.state.coin.ticker);
    const history = encodeURIComponent(this.state.coin.history);
    const technology = encodeURIComponent(this.state.coin.technology);
    const vp = encodeURIComponent(this.state.coin.vp);
    const upcoming = encodeURIComponent(this.state.coin.upcoming);
    const keyPeople = encodeURIComponent(this.state.coin.keyPeople);
    const ico = encodeURIComponent(this.state.coin.ico);
    const events = encodeURIComponent(this.state.upcomingEvent);
    const formData = `category=${category}&events=${events}&username=${username}&email=${email}&name=${name}&ticker=${ticker}&history=${history}&technology=${technology}&summary=${summary}&vp=${vp}&upcoming=${upcoming}&keyPeople=${keyPeople}&ico=${ico}`;
    // create an AJAX request


    const data = this.state.file;
    axios.post('api/image', data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      },
    })
    .then((response) => {
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
            errors: '',
            success: 'Successfully submitted your organization!',
          });
          setTimeout(function() {
            this.context.router.replace('/');
          }.bind(this),3000);
        } else {
          // failure


          this.setState({
            errors: 'There was a problem with submitting your information',
          });
        }
      });
      xhr.send(formData);
    }).catch((error) => {
      // handle error
      this.setState({errors:'There was an error saving the image!'});
    });

  }

  handleNext = () => {
    window.scrollTo(0, 0);
    const {stepIndex} = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  };

  handlePrev = () => {
    window.scrollTo(0, 0);
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  callback () {
    this.setState({disabled :  false});
  }

  onDrop (event) {
    const file = this.refs.file.files[0];

    if (file.type === 'image/jpeg' || file.type === 'image/png') {
      const reader = new FileReader();
      const url = reader.readAsDataURL(file);
      const data = new FormData();
      data.append('file', file);

      data.set('name', this.state.coin.name);


      reader.onloadend = function (e) {
        this.setState({
          picture: [reader.result],
          file: data,
          errors: '',
          disabled: false
        })
      }.bind(this);
    } else {
      this.setState({
          errors: 'Please Upload an .jpeg or .png file',
          disabled: true
        })
    }

  }

  addEvent(event) {
    const date = this.state.date.toString();
    const upcomingEvent = this.state.upcomingEvent;
    const myArr = {date: date, upcomingEvent: upcomingEvent}
    const joined = this.state.table.concat(myArr);
    this.setState({table: joined, date: new Date(), upcomingEvent: ''})
  }

  deleteEvent(event) {
    const row = this.state.selectedRows
    let spliced = this.state.table
    spliced.splice(row, 1)
    console.log(row)
    console.log(spliced)
    this.setState({table: spliced})

  }

  _onRowSelection(rows) {
    console.log(rows)
  this.setState({selectedRows: rows});
}

  imageUpload (event) {
    event.preventDefault()

  }

  getStepContent (stepIndex) {
    switch (stepIndex) {
      case 0:
        window.scrollTo(0, 0)
        return (
          <div>

          <RegisterPersonal
          onSubmit={this.processForm}
          onChange={this.updateUser}
          errors={this.state.errors}
          user={this.state.user}
          successMessage={this.state.successMessage}
          style={{width:1000,height:210}}
          />
          </div>
        );
      case 1:
        window.scrollTo(0, 0)
        return (
          <RegisterCoin
          onSubmit={this.processForm}
          onChange={this.updateCoin}
          handleChange={this.handleChange}
          errors={this.state.errors}
          coin={this.state.coin}
          values={this.state.values}
          successMessage={this.state.successMessage}
          style={{width:1000}}
          />);
      case 2:
        window.scrollTo(0, 0)
        return (
          <div>
          <div className="button-line">
            {this.state.errors && <p className="error-message">{this.state.errors}</p>}
            {this.state.success && <p className="success-message">{this.state.success}</p>}
            <img src={this.state.picture} style={{width:300,height:300}}/>
            <form action="/" >
              <input
              ref="file"
              type="file"
              name="file"
              id="file"
              onChange={this.onDrop.bind(this)}
              className="inputfile"
              />
              <label htmlFor="file"><strong><FontIcon className="material-icons" style={{color:'white',verticalAlign:'middle',paddingRight:'20px',display:'inline-block',fontSize:'18',paddingBottom:'5px'}}>add_a_photo</FontIcon>Choose a file</strong></label>
            </form>

          </div>
          </div>
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }
  disabled () {
    if(this.state.stepIndex === 2){
      if(this.state.disabled === true){
        return true
      } else {
        return false
      }
    } else {
      return false
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

      <div style={{width: '90%',  margin: 'auto'}}>
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
                      disabled={this.disabled()}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <p className="pageDesc">You need to  <Link to={'/signup'}>
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
