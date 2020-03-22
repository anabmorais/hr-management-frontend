import React, { Component } from "react";
import { Button, Calendar, Card, Typography, Tooltip, Popconfirm } from "antd";
import { CalendarOutlined, DeleteTwoTone } from "@ant-design/icons";
import AddAbsencesModal from "./AddAbsencesModal";
import moment from "moment";
import { getAbsences, createAbsence, deleteAbsence } from "../../api/absences";
import { getUsers } from "../../api/users";

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
      <ul className="absences-calendar-cell">
        {this.state.absences
          .filter(absence => this.isDateEqual(absence.date, date))
          .map(absence => (
            <Tooltip placement="left" title={absence.user.area}>
              <li key={absence.key}>
                {absence.user.name}
                <Popconfirm
                  placement="right"
                  title={`Are you sure to delete ${absence.user.name}'s absence?`}
                  onConfirm={() => this.handleAbsencesDelete(absence.key)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 15, marginLeft:"6px" }} />
                </Popconfirm>
              </li>
            </Tooltip>
          ))}
      </ul>
    );
  };

  handleAbsencesDelete = absenceId =>
    deleteAbsence(absenceId).then(() => {
      this.setState(stateCopy => {
        const absenceIndexToRemove = stateCopy.absences.findIndex(absence => absence.key === absenceId);

        if (absenceIndexToRemove !== -1) {
          stateCopy.absences.splice(absenceIndexToRemove, 1);
        }

        return stateCopy;
      });
    });

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
    const { users, isVisibleAddAbsences } = this.state;
    return (
      <>
        <Typography.Title level={3}>Absences</Typography.Title>
        <Card>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={this.handleClickAddAbsences}
            style={{ marginBottom: "12px" }}
          >
            Add
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
        </Card>
      </>
    );
  }
}

export default Absences;
