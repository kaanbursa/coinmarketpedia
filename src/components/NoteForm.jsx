import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';


const NoteForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  formula,
}) => (
  <Card className="noteForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Leave a Note</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Material Name"
          name="materialname"
          onChange={onChange}
          value={formula.name}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Reason"
          name="reason"
          onChange={onChange}
          value={formula.reason}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Submit" primary />
      </div>
    </form>
  </Card>
);

NoteForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  formula: PropTypes.object.isRequired,
};

export default NoteForm;
