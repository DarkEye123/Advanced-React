import React, { Component } from "react";
import { Query } from "react-apollo";
import SignIn from "./SignIn";
import { CURRENT_USER_QUERY } from "./User";

export default class RequireSignIn extends Component {
  render() {
    return (
      <Query query={CURRENT_USER_QUERY}>
        {({ data: { me }, loading }) => {
          if (loading) {
            return <p>Fetching data</p>;
          }
          if (!me) {
            return (
              <>
                <h2>You need to Sign In</h2>
                <SignIn />
              </>
            );
          }
          return this.props.children;
        }}
      </Query>
    );
  }
}
