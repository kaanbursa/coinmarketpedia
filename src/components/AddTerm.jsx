import React from 'react';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';



const AddTerm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  term,
}) => (
  <Card className="noteForm">
    <form action="/" onSubmit={onSubmit}>
      <h2 className="noteHeader">Add New Term</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errors.summary && <p className="error-message">{errors.summary}</p>}

      <div className="field-line">
        <TextField
          floatingLabelText="Term"
          name="name"
          onChange={onChange}
          value={term.name}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Description"
          name="description"
          onChange={onChange}
          value={term.description}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Add Term" primary />
      </div>
    </form>
  </Card>
);

AddTerm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  term: PropTypes.object.isRequired,
};

export default AddTerm;
