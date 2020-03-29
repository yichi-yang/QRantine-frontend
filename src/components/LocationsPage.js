import React from "react";
import {
  Header,
  Image,
  Container,
  Card,
  Button,
  Modal,
  Form,
  Dropdown
} from "semantic-ui-react";
import { connect } from "react-redux";
import axios from "axios";
import { setUserTokens, clearUserState } from "../actions";
import "react-phone-input-2/lib/semantic-ui.css";
import { siteUrl } from "../settings";
import RedirectButton from "./RedirectButton";

class LocationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      name: "",
      plus_code: "",
      thumbnail: "",
      community: "",
      communityOptions: [],
      saving: false
    };
  }

  fetchLocations = () => {
    axios
      .get("/api/location/")
      .then(response => {
        let { data } = response;
        this.setState({ locations: data });
      })
      .catch(error => {
        console.log(error);
      });
  };

  fetchOptions = () => {
    axios
      .get("/api/community/")
      .then(response => {
        let { data } = response;
        this.setState({
          communityOptions: data.map(community => ({
            key: community.id,
            value: community.id,
            text: community.name
          }))
        });
      })
      .catch(error => {
        console.log(error);
      });
  };

  addLocation = () => {
    this.setState({ saving: true });
    let { plus_code, name, thumbnail, community } = this.state;
    axios
      .post(`/api/location/`, {
        plus_code,
        name,
        thumbnail,
        community
      })
      .then(response => {
        this.setState(state => ({
          locations: state.locations.concat(response.data),
          saving: false,
          modalOpen: false,
          plus_code: "",
          name: "",
          thumbnail: "",
          community: ""
        }));
      })
      .catch(error => {
        console.log(error);
        this.setState({ saving: false });
      });
  };

  componentDidMount = () => {
    this.fetchLocations();
    this.fetchOptions();
  };

  render() {
    return (
      <Container style={{ margin: "5em auto" }}>
        <Header
          as="h1"
          textAlign="center"
          size="huge"
          style={{ fontSize: "3em", marginBottom: "1em" }}
        >
          All Locations
          <Header.Subheader>
            <RedirectButton
              redirect={{ to: "/", push: true }}
              button={{
                content: "Home",
                size: "large",
                style: {
                  display: "inline-block",
                  backgroundColor: "#0000",
                  padding: "0",
                  margin: "5px 1em 0 auto"
                }
              }}
            />
            <Button
              content="Add a Location"
              size="large"
              style={{
                display: "inline-block",
                backgroundColor: "#0000",
                padding: "0",
                margin: "5px auto 0 auto"
              }}
              onClick={() => {
                this.setState({ modalOpen: true });
              }}
            />
          </Header.Subheader>
        </Header>

        <Modal
          open={this.state.modalOpen}
          size="small"
          onClose={() => this.setState({ modalOpen: false })}
        >
          <Modal.Header>Add New Location</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                value={this.state.name}
                label="Title"
                required
                onChange={(e, { value }) => this.setState({ name: value })}
              />
              <Form.Input
                value={this.state.plus_code}
                label="Plus Code"
                required
                onChange={(e, { value }) => this.setState({ plus_code: value })}
              />
              <Form.Input
                value={this.state.thumbnail}
                label="Thumbnail URL"
                required
                onChange={(e, { value }) => this.setState({ thumbnail: value })}
              />
              <Form.Field
                control={Dropdown}
                placeholder="Select Community"
                label="City / Community"
                fluid
                search
                selection
                options={this.state.communityOptions}
                value={this.state.community}
                onChange={(e, { value }) => this.setState({ community: value })}
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="black"
              content="cancel"
              onClick={() => this.setState({ modalOpen: false })}
            />
            <Button
              positive
              content="send"
              loading={this.state.saving}
              disabled={this.state.saving}
              onClick={this.addLocation}
            />
          </Modal.Actions>
        </Modal>

        <Card.Group itemsPerRow={3} stackable>
          {this.state.locations &&
            this.state.locations.map(location => {
              let card = (
                <Card key={location.id} link>
                  <Image
                    src={location.thumbnail}
                    wrapped
                    ui={false}
                    style={{ maxHeight: 300, overflow: "hidden" }}
                  />
                  <Card.Content>
                    <Card.Header>{location.name}</Card.Header>
                    <Card.Meta>{location.plus_code}</Card.Meta>
                    <Card.Description>
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          siteUrl + "add/" + location.plus_code + "/"
                        )}`}
                      />
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    {location.community
                      ? `${location.community.cases} case(s) in ${location.community.name}`
                      : location.community
                      ? location.community.name
                      : "no statistics"}
                  </Card.Content>
                </Card>
              );
              return (
                <Modal
                  trigger={card}
                  basic
                  size="mini"
                  key={location.id}
                >
                  <Modal.Content>
                    <Card.Group itemsPerRow={1}>{card}</Card.Group>
                  </Modal.Content>
                </Modal>
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
)(LocationsPage);
