import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($email: String!, $name: String, $password: String!) {
    signUp(email: $email, name: $name, password: $password) {
      id
    }
  }
`;

export default class SignUp extends Component {
  state = {
    email: "",
    name: "",
    password: "",
  };

  updateState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signUp, { loading, error }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const resp = await signUp();
                this.setState({ email: "", name: "", password: "" });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <ErrorMessage error={error} />
                <h2>Sign Up for An Account</h2>
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="name"
                    onChange={this.updateState}
                    value={this.state.name}
                  />
                </label>
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
              <button type="submit">Register</button>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}
