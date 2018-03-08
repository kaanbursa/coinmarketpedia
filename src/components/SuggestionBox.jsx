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

const SuggestionBox = ({
  onSubmit,
  onChange,
  errors,
  success,
  coin,
}) => (
  <Card className="registerForm" style={{boxShadow:'none'}}>
    <form style={{border:'none'}} action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader" style={{float:'center'}}>Contribute Information!</h2>
      {success && <p className="success-message">{success}</p>}
      {errors && <p className="error-message">{errors}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="Add New Information"
          name="from"
          onChange={onChange}
          value={coin.from}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Change Information"
          name="to"
          onChange={onChange}
          value={coin.to}
          style={styles.textFld}
        />
      </div>
        <FlatButton label="Submit" type="submit" fullWidth={true} />
    </form>
  </Card>
);

SuggestionBox.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.string,
  success: PropTypes.string,
  successMessage: PropTypes.string,
  coin: PropTypes.object.isRequired,
};

export default SuggestionBox;
