import React from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import Recaptcha from 'react-recaptcha';

const styles = {
    textFld: { width: '100%'},
    bigFld: { width: '50%', height:'auto', textAlign: 'left'}
};

const MyPosts = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  coin,
}) => (
  <Card className="registerForm" style={{boxShadow:'none'}}>
    <form style={{border:'none'}} action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader" style={{float:'left'}}>My Submission</h2>
      <div className="field-line">
        <TextField
          floatingLabelText="Coin Name"
          name="name"
          onChange={onChange}
          value={coin.name}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Ticker"
          name="ticker"
          onChange={onChange}
          value={coin.ticker}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText='Value Proposition'
          name="vp"
          onChange={onChange}
          value={coin.vp}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText='ICO Price'
          name="ico"
          onChange={onChange}
          value={coin.ico}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Summary of Your Coin"
          name="summary"
          onChange={onChange}
          value={coin.summary}
          multiLine={true}
          style={{textAlign:'left', width:'100%'}}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Technology"
          name="technology"
          onChange={onChange}
          value={coin.technology}
          style={{textAlign:'left', width:'100%'}}
          multiLine={true}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Key People"
          name="keyPeople"
          onChange={onChange}
          value={coin.keyPeople}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="History"
          name="history"
          onChange={onChange}
          value={coin.history}
          style={{textAlign:'left', width:'100%'}}
          multiLine={true}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Upcoming Events"
          name="upcoming"
          onChange={onChange}
          value={coin.upcoming}
          style={{textAlign:'left', width:'100%'}}
          multiLine={true}
        />
      </div>
        <FlatButton label="Save Changes" type="submit" fullWidth={true} />
    </form>
  </Card>
);

MyPosts.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  successMessage: PropTypes.string,
  coin: PropTypes.object.isRequired,
};

export default MyPosts;
