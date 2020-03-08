import React, { Component } from "react";
import { Button } from "antd";
import CreateEditUserModal from "./CreateEditUserModal";
import UsersList from "./UsersList";
import { createUser, deleteUser, getUsers, editUser } from "../../api/users";
import moment from "moment";

class App extends Component {
  state = {
    users: [],
    isVisibleCreateEditUser: false,
    editUserId: null
  };

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

  componentDidMount() {
    this.getAllUsers();
  }

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

  handleClickCreate = () => {
    this.setState({ isVisibleCreateEditUser: true });
  };

  handleClickEdit = userId => {
    this.setState({
      isVisibleCreateEditUser: true,
      editUserId: userId
    });
  };

  handleClickDelete = userId =>
    deleteUser(userId).then(() => {
      this.setState(stateCopy => {
        const userIndexToRemove = stateCopy.users.findIndex(user => user.key === userId);

        if (userIndexToRemove !== -1) {
          stateCopy.users.splice(userIndexToRemove, 1);
        }

        return stateCopy;
      });
    });

  render() {
    const { users, isVisibleCreateEditUser, editUserId } = this.state;

    const editUser = editUserId ? users.find(user => user.key === editUserId) : undefined;

    return (
      <div>
        <Button type="primary" onClick={this.handleClickCreate}>
          Create User
        </Button>
        {isVisibleCreateEditUser && (
          <CreateEditUserModal
            visible={isVisibleCreateEditUser}
            onSubmit={editUserId ? this.handleSubmitEdit : this.handleSubmitCreate}
            onCancel={this.handleCancelCreateEdit}
            user={editUser}
          />
        )}
        <UsersList users={users} onClickEdit={this.handleClickEdit} onClickDelete={this.handleClickDelete} />
      </div>
    );
  }
}

export default App;
