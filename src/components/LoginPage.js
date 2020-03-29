import React from "react";
import {
  Form,
  Grid,
  Header,
  Image,
  Segment,
  Button,
  Message
} from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import { setUserTokens, clearUserState } from "../actions";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/semantic-ui.css";
import { Redirect } from "react-router-dom";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { codeSent: false, phone: "", code: "", success: false };
  }

  verify = () => {
    let { phone } = this.state;
    let [country_code, ...rest] = phone.split(" ");
    let phone_number = rest.join("").replace(/\D/g, "");
    console.log(country_code, phone_number);
    axios
      .post(
        "/api/verify/",
        {
          phone_number,
          country_code
        },
        {
          skipAuthRefresh: true,
          NoJWT: true
        }
      )
      .then(() => {
        this.setState({
          codeSent: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  login = () => {
    let { phone, code } = this.state;
    let [country_code, ...rest] = phone.split(" ");
    let phone_number = rest.join("").replace(/\D/g, "");
    axios
      .post(
        "/api/token/",
        {
          phone_number,
          country_code,
          token: code
        },
        {
          skipAuthRefresh: true,
          NoJWT: true
        }
      )
      .then(response => {
        let { data } = response;
        this.props.setUserTokens(data);
        this.setState({
          success: true
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    if (this.state.success) {
      return <Redirect to="/" push />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            <Image src="/logo.png" /> Log-in to your account
          </Header>
          <Form size="large">
            <Segment>
              <Form.Field
                control={PhoneInput}
                country={"us"}
                value={this.state.phone}
                name="phone"
                onChange={phone => this.setState({ phone })}
                placeholder="phone number"
                disabled={this.state.codeSent}
              />
              {this.state.codeSent && (
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="verification code"
                  type="password"
                  value={this.state.code}
                  onChange={(e, { value }) => this.setState({ code: value })}
                />
              )}

              {this.state.codeSent && (
                <Button color="teal" fluid size="large" onClick={this.login}>
                  Login
                </Button>
              )}
              {!this.state.codeSent && (
                <Button color="teal" fluid size="large" onClick={this.verify}>
                  Get Verification Code
                </Button>
              )}
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

export default connect(
  state => ({
    tokens: state.user.tokens
  }),
  {
    setUserTokens,
    clearUserState
  }
)(LoginPage);
