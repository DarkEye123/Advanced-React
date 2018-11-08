import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";
import { CURRENT_USER_QUERY } from "./User";

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
    }
  }
`;

export default class SignIn extends Component {
  state = {
    email: "",
    password: "",
  };

  updateState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signIn, { loading, error }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const resp = await signIn();
                this.setState({ email: "", password: "" });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <ErrorMessage error={error} />
                <h2>Sign In</h2>
                <label htmlFor="email">
                  Email
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="email"
                    onChange={this.updateState}
                    value={this.state.email}
                  />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="text"
                    id="password"
                    name="password"
                    placeholder="password"
                    onChange={this.updateState}
                    value={this.state.password}
                  />
                </label>
              </fieldset>
              <button type="submit">Sign In</button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}
