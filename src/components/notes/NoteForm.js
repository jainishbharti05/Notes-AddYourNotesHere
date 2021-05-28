import React from "react";
import { Field, reduxForm } from "redux-form";
// import { connect } from "react-redux";

// import { createNote } from "../../actions";

class NoteForm extends React.Component {
  renderError({ error, touched }) {
    if (touched && error) {
      return <div className="invalid-feedback">{error}</div>;
    }
  }

  renderInput = ({ input, meta }) => {
    const className = `form-control ${
      meta.error && meta.touched ? " is-invalid" : ""
    }`;
    return (
      <div className="form-group">
        <h4>Create your Note here</h4>
        <textarea className={className} {...input} rows="5"></textarea>
        {this.renderError(meta)}
        <button type="submit" className="btn btn-outline-secondary my-4">
          Submit
        </button>
      </div>
    );
  };

  onSubmit = (formValues) => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <div className="container-sm my-4">
        <form onSubmit={this.props.handleSubmit(this.onSubmit)}>
          <Field name="note" component={this.renderInput} />
        </form>
      </div>
    );
  }
}

const validate = (formValues) => {
  const errors = {};
  if (!formValues.note) {
    errors.note = "You must enter something in the text area.";
  }
  return errors;
};

export default reduxForm({
  form: "createNoteForm",
  validate,
})(NoteForm);
