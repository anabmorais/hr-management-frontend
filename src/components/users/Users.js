import React, { Component } from "react";
import { Button, Card, Typography, Popconfirm, message } from "antd";
import { UserAddOutlined,  } from "@ant-design/icons";
import CreateEditUserModal from "./CreateEditUserModal";
import UsersList from "./UsersList";
import EditCredentialsModal from "./EditCredentialsModal";
import { createUser, deleteUser, getUsers, editUser, updateUserCredentials } from "../../api/users";
import moment from "moment";

class App extends Component {
  state = {
    users: [],
    isVisibleCreateEditUser: false,
    isVisibleCredentials: false,
    editUserId: null
  };

  componentDidMount() {
    this.getAllUsers();
  }

  getAllUsers = () =>
    getUsers().then(data => {
      this.setState({
        users: data.map(user => ({
          key: user.id,
          username: user.username,
          name: user.name,
          birthday: user.birthday ? moment(user.birthday) : null,
          area: user.area
        }))
      });
    });

  handleSubmitCreate = values =>
    createUser(values.name, values.birthday, values.area)
      .then(user => {
        this.setState(stateCopy => {
          stateCopy.isVisibleCreateEditUser = false;

          stateCopy.users.push({
            key: user.id,
            username: user.username,
            name: user.name,
            birthday: user.birthday ? moment(user.birthday) : null,
            area: user.area
          });

          return stateCopy;
        });
      })
      .catch(error => {});

  handleSubmitEdit = values =>
    editUser(this.state.editUserId, values.name, values.birthday, values.area)
      .then(user => {
        this.setState(stateCopy => {
          const userIndexToEdit = stateCopy.users.findIndex(user => user.key === stateCopy.editUserId);

          if (userIndexToEdit !== -1) {
            stateCopy.users[userIndexToEdit] = {
              key: user.id,
              username: user.username,
              name: user.name,
              birthday: user.birthday ? moment(user.birthday) : null,
              area: user.area
            };
          }

          stateCopy.isVisibleCreateEditUser = false;
          stateCopy.editUserId = null;

          return stateCopy;
        });
      })
      .catch(error => {});

  handleCancelCreateEdit = () => {
    this.setState({
      isVisibleCreateEditUser: false,
      editUserId: null
    });
  };

  handleSubmitCredentials = values =>
    updateUserCredentials(this.state.editUserId, values.username, values.password, values.area)
      .then(user => {
        this.setState(stateCopy => {
          const userIndexToEdit = stateCopy.users.findIndex(user => user.key === stateCopy.editUserId);

          if (userIndexToEdit !== -1) {
            stateCopy.users[userIndexToEdit] = {
              key: user.id,
              username: user.username,
              name: user.name,
              birthday: user.birthday ? moment(user.birthday) : null,
              area: user.area
            };
          }

          stateCopy.isVisibleCredentials = false;
          stateCopy.editUserId = null;

          return stateCopy;
        });
      })
      .catch(error => {});

  handleCancelCredentials = () => {
    this.setState({
      isVisibleCredentials: false,
      editUserId: null
    });
  };

  handleClickCreate = () => {
    this.setState({ isVisibleCreateEditUser: true });
  };

  handleClickEdit = userId => {
    this.setState({
      isVisibleCreateEditUser: true,
      editUserId: userId
    });
  };

  handleClickCredentials = userId => {
    this.setState({
      isVisibleCredentials: true,
      editUserId: userId
    });
  };

  handleClickDelete = userId => {
    deleteUser(userId).then(() => {
      this.setState(stateCopy => {
        const userIndexToRemove = stateCopy.users.findIndex(user => user.key === userId);

        if (userIndexToRemove !== -1) {
          stateCopy.users.splice(userIndexToRemove, 1);
        }

        return stateCopy;
      });
    })};

  render() {
    const { users, isVisibleCreateEditUser, isVisibleCredentials, editUserId } = this.state;

    const editUser = editUserId ? users.find(user => user.key === editUserId) : undefined;

    return (
      <>
        <Typography.Title level={3}>Users</Typography.Title>
        <Card>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={this.handleClickCreate}
            style={{ marginBottom: "12px" }}
          >
            Create
          </Button>
          {isVisibleCreateEditUser && (
            <CreateEditUserModal
              visible={isVisibleCreateEditUser}
              onSubmit={editUserId ? this.handleSubmitEdit : this.handleSubmitCreate}
              onCancel={this.handleCancelCreateEdit}
              user={editUser}
            />
          )}
          {isVisibleCredentials && (
            <EditCredentialsModal
              visible={isVisibleCredentials}
              onSubmit={this.handleSubmitCredentials}
              onCancel={this.handleCancelCredentials}
              user={editUser}
            />
          )}
          <UsersList
            users={users}
            onClickEdit={this.handleClickEdit}
            onClickCredentials={this.handleClickCredentials}
            onClickDelete={this.handleClickDelete}
          />
        </Card>
      </>
    );
  }
}

export default App;
