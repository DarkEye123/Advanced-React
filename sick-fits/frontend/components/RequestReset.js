import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestResetToken(email: $email)
  }
`;

export default class RequestReset extends Component {
  state = {
    email: "",
  };

  updateState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestResetToken, { data, loading, error }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const token = await requestResetToken();
                this.setState({ email: "" });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <ErrorMessage error={error} />
                {(!error && !loading && data && data.requestResetToken && <h2>Please, check your email</h2>) || (
                  <h2>Request Reset Password</h2>
                )}
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={this.updateState}
                    value={this.state.email}
                  />
                </label>
              </fieldset>
              <button type="submit">Confirm</button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}
