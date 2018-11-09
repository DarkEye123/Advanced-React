import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import Router from "next/router";
import ErrorMessage from "./ErrorMessage";
import Form from "./styles/Form";
import { CURRENT_USER_QUERY } from "./User";

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!) {
    resetPassword(resetToken: $resetToken, password: $password) {
      message
    }
  }
`;

export default class ResetPassword extends Component {
  state = {
    email: "",
    password: "",
    confirmPassword: "",
    error: null,
  };

  updateState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ password: this.state.password, resetToken: this.props.token }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { loading, error }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                if (this.state.password !== this.state.confirmPassword) {
                  this.setState({ error: "Passwords don't match", password: "", confirmPassword: "" });
                } else {
                  await resetPassword();
                  this.setState({ error: null, email: "", password: "", confirmPassword: "" });
                  if (!error || loading) {
                    Router.push({
                      pathname: "/",
                    });
                  }
                }
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <ErrorMessage error={error || { message: this.state.error }} />
                <h2>Reset Password</h2>
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
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={this.updateState}
                    value={this.state.password}
                  />
                </label>
                <label htmlFor="confirmPassword">
                  Confirm Password
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="verify password"
                    onChange={this.updateState}
                    value={this.state.confirmPassword}
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

ResetPassword.propTypes = { token: PropTypes.string.isRequired };
