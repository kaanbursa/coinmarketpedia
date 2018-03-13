import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';

const styles = {
    textFld: { width: '100%'},
    bigFld: { width: '50%', height:'auto', textAlign: 'left'}
};

const EditUser = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user,
}) => (
  <Card className="registerForm" style={{boxShadow:'none'}}>
    <form style={{border:'none'}} action="/" onSubmit={onSubmit}>

      <div className="field-line">
        <TextField
          floatingLabelText="Username"
          name="username"
          onChange={onChange}
          value={user.username}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Email"
          name="Email"
          onChange={onChange}
          value={user.email}
          style={styles.textFld}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="About You"
          name="about"
          onChange={onChange}
          value={user.about}
          style={styles.textFld}
        />
      </div>

        <FlatButton label="Save Changes" type="submit" fullWidth={true} />
    </form>
  </Card>
);

EditUser.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object,
  successMessage: PropTypes.string,
  user: PropTypes.object.isRequired,
};

export default EditUser;
