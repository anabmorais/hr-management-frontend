import React, { Component } from "react";
import { Calendar, Button } from "antd";
import { getAbsences, createAbsence } from "../../api/absences";
import AddAbsencesModal from "./AddAbsencesModal"
import {getUsers} from "../../api/users"
import moment from "moment";

class Absences extends Component {
  state = {
    absences: [],
    users: [],
    isVisibleAddAbsences: false,
    addAbsenceId: null
  };

  getAllAbsences = () =>
    getAbsences().then(data => {
      this.setState({
        absences: data.map(absence => ({
          key: absence.id,
          date: moment(absence.date),
          user: absence.user
        }))
      });
    });

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
    this.getAllAbsences();
    this.getAllUsers();
  }

  isDateEqual = (dateA, dateB) =>
    dateA.year() === dateB.year() && dateA.month() === dateB.month() && dateA.date() === dateB.date();

  dateCellRender = date => {
    return (
      <ul className="events">
        {this.state.absences
          .filter(absence => this.isDateEqual(absence.date, date))
          .map(absence => (
            <li key={absence.key}>
              {absence.user.name}
            </li>
          ))}
      </ul>
    );
  };

  handleClickAddAbsences = () => {
    this.setState({ isVisibleAddAbsences: true });
  };

  handleSubmitAbsences = values =>
  createAbsence(values.userId, values.date)
    .then(absence => {
      this.setState(stateCopy => {
        stateCopy.isVisibleAddAbsences = false;

        stateCopy.absences.push({
          key: absence.id,
          date: moment(absence.date),
          user: absence.user
        });

        return stateCopy;
      });
    })
    .catch(error => {});

  handleCancelAbsences = () => {
    this.setState({
      isVisibleAddAbsences: false,
      addAbsenceId: null
    });
  };

  render() {
    const {users, isVisibleAddAbsences} = this.state
    return (
      <div>
         <Button type="primary" onClick={this.handleClickAddAbsences}>
          Add absences
        </Button>
        <Calendar dateCellRender={this.dateCellRender} mode="month" />
        {isVisibleAddAbsences && (
          <AddAbsencesModal
            visible={isVisibleAddAbsences}
            onSubmit={this.handleSubmitAbsences}
            onCancel={this.handleCancelAbsences}
            users={users}
          />
        )}
      </div>
    );
  }
}

export default Absences;
