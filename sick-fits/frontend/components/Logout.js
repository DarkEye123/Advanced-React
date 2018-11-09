import React, { Component } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const LOGOUT_MUTATION = gql`
  mutation LOGOUT_MUTATION {
    logout
  }
`;

export default class Logout extends Component {
  render() {
    return (
      <Mutation mutation={LOGOUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(logout, _) => <a onClick={async () => await logout()}>{this.props.children}</a>}
      </Mutation>
    );
  }
}
