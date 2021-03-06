import React, { Component } from "react";
import { withRouter } from "react-router";
import { Container, Col, Row, Form, FormGroup } from "reactstrap";

import { Heading, Field, Input, Button, Card } from "rimble-ui";

class DeclineEndorsement extends Component {
  constructor(props) {
    super(props);

    const { drizzle, drizzleState } = this.props;

    this.state = {
      account: drizzleState.accounts[0],
      userAddress: "",

      status: "initialized",
      modal: false,
      transactionHash: "",
      modalSuccess: true,
      modalPending: true,
      modalBody: "",
      modalTitle: ""
    };

    this.contracts = props.drizzle.contracts;
    this.drizzle = props.drizzle;
    this.web3 = props.drizzle.web3;

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChangeUserAddress = this.onChangeUserAddress.bind(this);
    //this.modalToggle = this.modalToggle.bind(this);
  }

  onChangeUserAddress(event) {
    this.setState({ userAddress: event.target.value });
  }

  componentDidMount() {
    const { drizzle } = this.props;

    // subscribe to changes in the store
    this.unsubscribe = drizzle.store.subscribe(() => {
      // every time the store updates, grab the state from drizzle
      const drizzleState = drizzle.store.getState();

      // check to see if it's ready, if so, update local component state
      if (drizzleState.drizzleStatus.initialized) {
        if (drizzleState.transactionStack[this.state.transactionId]) {
          const transactionHash =
            drizzleState.transactionStack[this.state.transactionId];
          if (
            drizzleState.transactions[transactionHash].status == "pending" &&
            this.state.modalPending
          ) {
            this.setState({
              transactionHash: transactionHash,
              modalPending: false,
              userAddress: ""
            });
          }
          if (
            drizzleState.transactions[transactionHash].status == "success" &&
            this.state.modalSuccess
          ) {
            this.setState({
              transactionHash: transactionHash,
              modalSuccess: false
            });
          }
        }
      }
    });
  }

  async onFormSubmit(event) {
    event.preventDefault();

    const stackId = this.contracts.Debt.methods.declineEndorsement.cacheSend(
      this.state.userAddress,
      { from: this.state.account }
    );

    this.setState({ transactionId: stackId });
  }

  render() {
    return (
      <>
        <Container className="mt-4">
          <Row className="justify-content-center">
            <Col lg="6">
              <Heading.h2>Decline Endorsement</Heading.h2>
              <Card className="mt-4 mx-auto">
                <Form className="form" onSubmit={this.onFormSubmit}>
                  <FormGroup>
                    <Field label="User Address">
                      <Input
                        name="userAddress"
                        value={this.state.userAddress}
                        onChange={this.onChangeUserAddress}
                        required={true}
                        width={"100%"}
                      />
                    </Field>
                  </FormGroup>

                  <Button type="submit">Decline endorsement</Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default withRouter(DeclineEndorsement);
