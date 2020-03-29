import React from "react";
import {
  Label,
  Header,
  Image,
  Container,
  Card,
  Button,
  Modal,
  Form
} from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import { setUserTokens, clearUserState } from "../actions";
import "react-phone-input-2/lib/semantic-ui.css";
import { Redirect, Link } from "react-router-dom";
import moment from "moment";
import RedirectButton from "./RedirectButton";

class FrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { records: null, modalOpen: null, text: "", sending: false };
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

  sendMessage = () => {
    this.setState({ sending: true });
    axios
      .post(`/api/record/${this.state.modalOpen}/message/`, {
        message: this.state.text
      })
      .then(() => {
        this.setState({ sending: false, modalOpen: null });
      })
      .catch(error => {
        console.log(error);
      });
  };

  delete = id => {
    axios
      .delete(`/api/record/${id}/`)
      .then(() => {
        this.setState(state => ({
          records: state.records.filter(record => record.id !== id)
        }));
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
      <Container style={{ margin: "5em auto" }}>
        <Header
          as="h1"
          textAlign="center"
          size="huge"
          style={{ fontSize: "3em", marginBottom: "1em" }}
        >
          Places I Visited
          <Header.Subheader>
            <RedirectButton
              redirect={{ to: "/locations/", push: true }}
              button={{
                content: "All Locations",
                size: "large",
                style: {
                  display: "block",
                  backgroundColor: "#0000",
                  padding: "0",
                  margin: "5px auto 0 auto"
                }
              }}
            />
          </Header.Subheader>
        </Header>
        <Card.Group itemsPerRow={3} stackable>
          {this.state.records &&
            this.state.records.map(record => {
              let color = null;
              let warningText = "No Statistics";
              if (record.community_cases !== null) {
                if (record.community_cases >= 10) {
                  color = "red";
                  warningText = "High Risk";
                } else if (record.community_cases >= 1) {
                  color = "orange";
                  warningText = "Medium Risk";
                } else {
                  color = "green";
                  warningText = "Low Risk";
                }
              }
              return (
                <Card key={record.id} color={color}>
                  <Image
                    src={record.location.thumbnail}
                    wrapped
                    ui={false}
                    style={{ maxHeight: 300, overflow: "hidden" }}
                  />
                  <Card.Content>
                    <Card.Header>{record.location.name}</Card.Header>
                    <Card.Meta>
                      {moment(record.visited_at).format("LLLL")}
                    </Card.Meta>
                    <Card.Description>
                      <Modal
                        trigger={
                          <Button
                            content="Send a Message to Visitors"
                            style={{ backgroundColor: "#0000", padding: "0" }}
                            onClick={() => {
                              this.setState({ modalOpen: record.id, text: "" });
                            }}
                          />
                        }
                        open={this.state.modalOpen === record.id}
                        size="small"
                        onClose={() => this.setState({ modalOpen: null })}
                      >
                        <Modal.Header>Contact Visitors</Modal.Header>
                        <Modal.Content>
                          <Form>
                            <Form.TextArea
                              value={this.state.text}
                              rows={5}
                              onChange={(e, { value }) =>
                                this.setState({ text: value })
                              }
                            />
                          </Form>
                          <p style={{ marginTop: "5px" }}>
                            Send a text message to all people who visited{" "}
                            {record.location.name}.
                          </p>
                        </Modal.Content>
                        <Modal.Actions>
                          <Button
                            color="black"
                            content="cancel"
                            onClick={() => this.setState({ modalOpen: null })}
                          />
                          <Button
                            positive
                            content="send"
                            loading={this.state.sending}
                            disabled={this.state.sending}
                            onClick={this.sendMessage}
                          />
                        </Modal.Actions>
                      </Modal>
                      <Button
                        content="Remove"
                        style={{
                          backgroundColor: "#0000",
                          color: "#db2828",
                          padding: "0",
                          display: "block",
                          marginTop: "0.5em"
                        }}
                        onClick={() => this.delete(record.id)}
                        color="red"
                      />
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Label content={warningText} color={color} horizontal />
                    {record.location.community
                      ? `${record.location.community.cases} case(s) in ${record.location.community.name}`
                      : ""}
                  </Card.Content>
                </Card>
              );
            })}
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
