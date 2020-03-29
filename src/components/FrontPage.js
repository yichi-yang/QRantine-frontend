import React from "react";
import {
  Form,
  Grid,
  Header,
  Image,
  Segment,
  Button,
  Message,
  Container,
  Card,
  Icon
} from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import { setUserTokens, clearUserState } from "../actions";
import "react-phone-input-2/lib/semantic-ui.css";
import { Redirect } from "react-router-dom";

class FrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { records: null };
  }

  fetchRecords = () => {
    axios
      .get("/api/record/")
      .then(response => {
        let { data } = response;
        this.setState({ records: data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    if (this.props.tokens) {
      this.fetchRecords();
    }
  };

  render() {
    if (!this.props.tokens) {
      return <Redirect to="/login/" />;
    }
    return (
      <Container text>
        <Card.Group itemsPerRow={2} stackable>
          {this.state.records &&
            this.state.records.map(record => (
              <Card key={record.id}>
                <Image src={record.location.thumbnail} wrapped ui={false} />
                <Card.Content>
                  <Card.Header>{record.location.name}</Card.Header>
                  <Card.Meta>
                    <span className="date">Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <a>
                    <Icon name="user" />
                    22 Friends
                  </a>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>
      </Container>
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
)(FrontPage);
