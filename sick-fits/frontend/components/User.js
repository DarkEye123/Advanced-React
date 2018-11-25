import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      name
      email
      permissions
      cart {
        id
        quantity
        item {
          id
          price
          title
          image
        }
      }
    }
  }
`;
export default class User extends Component {
  render() {
    return <Query query={CURRENT_USER_QUERY}>{payload => this.props.children(payload)}</Query>;
  }
}

User.propTypes = {
  children: PropTypes.func.isRequired,
};
