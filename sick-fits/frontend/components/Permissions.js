import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Table from "../components/styles/Table";
import SickButton from "../components/styles/SickButton";
import Loading from "../components/Loading";
import PropTypes, { string, array } from "prop-types";

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      email
      name
      permissions
    }
  }
`;

const SUPPORTED_PERMISSIONS_QUERY = gql`
  query SUPPORTED_PERMISSIONS_QUERY {
    __type(name: "Permission") {
      states: enumValues {
        name
      }
    }
  }
`;

const TableHead = ({ permissions }) => {
  return permissions.map(name => <th key={name}>{name}</th>);
};

function transformPermissions(permissions) {
  let tmp = [];
  permissions.forEach(item => {
    tmp.push(item.name);
  });
  return tmp;
}

class User extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      email: string,
      name: string,
      id: string,
      permissions: array,
    }),
  };

  state = {
    permissions: this.props.user.permissions,
  };

  handlePermissionChange = e => {
    let currentPermissions;
    if (e.target.checked) {
      currentPermissions = [...this.state.permissions, e.target.value];
    } else {
      currentPermissions = this.state.permissions.filter(permission => permission != e.target.value);
    }
    this.setState({ permissions: currentPermissions });
  };

  render() {
    const { user, availablePermissions } = this.props;
    return (
      <tr>
        <td>{user.email}</td>
        <td>{user.name}</td>
        {availablePermissions.map(permission => (
          <td key={`${user.id}-permission-${permission}`}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                type="checkbox"
                value={permission}
                onChange={this.handlePermissionChange}
                checked={this.state.permissions.includes(permission)}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    );
  }
}

export default class Permissions extends Component {
  render() {
    return (
      <Query query={ALL_USERS_QUERY}>
        {({ data: { users }, error, loading }) => {
          if (error) {
            return <ErrorMessage error={error} />;
          }
          if (loading) {
            return <Loading />;
          }
          return (
            <Query query={SUPPORTED_PERMISSIONS_QUERY}>
              {({
                data: {
                  __type: { states },
                },
                error,
              }) => {
                if (error) return <ErrorMessage error={error} />;
                const permissions = transformPermissions(states);
                return (
                  <div>
                    <h2>Manage Permissions</h2>
                    <div>
                      <Table>
                        <thead>
                          <tr>
                            <th>Email</th>
                            <th>Name</th>
                            <TableHead permissions={permissions} />
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <User key={user.id} user={user} availablePermissions={permissions} />
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                );
              }}
            </Query>
          );
        }}
      </Query>
    );
  }
}
