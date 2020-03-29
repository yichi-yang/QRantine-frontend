import React from "react";
import { Container } from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import "react-phone-input-2/lib/semantic-ui.css";
import { Redirect } from "react-router-dom";

class AddPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { success: false };
  }

  addRecords = () => {
    axios
      .get(`/api/location/plus_code/${this.props.plus_code}/`)
      .then(response => {
        axios
          .post("/api/record/", { location: response.data.id })
          .then(() => this.setState({ success: true }));
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    if (this.props.tokens) {
      this.addRecords();
    }
  };

  render() {
    if (!this.props.tokens) {
      return (
        <Redirect
          to={{
            pathname: "/login/",
            state: { plus_code: this.props.plus_code }
          }}
        />
      );
    }
    if (this.state.success) {
      return <Redirect to="/" />;
    }
    return <Container text>Working</Container>;
  }
}

export default connect(state => ({
  tokens: state.user.tokens
}))(AddPage);
