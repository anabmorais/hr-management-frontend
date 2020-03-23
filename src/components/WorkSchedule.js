import React, { Component } from "react";
import { message, Row, Col, Affix, Alert } from "antd";
import Scheduler, { SchedulerData, ViewTypes, CellUnits, DATE_FORMAT } from "react-big-scheduler";
import moment from "moment";
import { getUsers } from "../api/users";
import { getTasks } from "../api/tasks";
import { createEvent, editEvent, deleteEvent, getEvents } from "../api/work-schedule";
import { getAbsences } from "../api/absences";

moment.locale("pt-pt");

class WorkSchedule extends Component {
  static defaultProps = {
    allowEdit: false
  };

  constructor(props) {
    super(props);

    const schedulerData = new SchedulerData(
      new moment().format(DATE_FORMAT),
      ViewTypes.Day,
      false,
      false,
      {
        schedulerWidth: 1350,
        dayResourceTableWidth: 150,
        dayCellWidth: 120,
        dayStartFrom: 8,
        dayStopTo: 17,
        startResizable: props.allowEdit,
        endResizable: props.allowEdit,
        movable: props.allowEdit,
        creatable: props.allowEdit,
        checkConflict: true,
        recurringEventsEnabled: false,
        resourceName: "Employee",
        eventItemPopoverDateFormat: " ",
        nonAgendaDayCellHeaderFormat: "HH",
        minuteStep: 60,
        views: [{ viewName: "Daily Schedule", viewType: ViewTypes.Day, showAgenda: false, isEventPerspective: false }]
      },
      {
        isNonWorkingTimeFunc: (schedulerData, time) => {
          const { localeMoment } = schedulerData;

          const dayOfWeek = localeMoment(time).weekday();
          if (schedulerData.cellUnit === CellUnits.Hour) {
            const hour = localeMoment(time).hour();
            return hour < 8 || hour > 18 || dayOfWeek === 0 || dayOfWeek === 6;
          } else {
            return dayOfWeek === 0 || dayOfWeek === 6;
          }
        }
      }
    );

    schedulerData.localeMoment.locale("pt-pt");

    schedulerData.setEvents([]);

    this.state = {
      users: [],
      tasks: [],
      absences: [],
      schedulerData,
      activeTaskId: null
    };
  }

  componentDidMount() {
    this.getAllUsers();
    this.getAllTasks();
    this.getDayAbsences(this.state.schedulerData);
    this.getDayEvents(this.state.schedulerData);
  }

  getAllUsers = () =>
    getUsers().then(data => {
      this.setState(stateCopy => {
        stateCopy.users = data.map(user => ({
          id: user.id,
          username: user.username,
          name: user.name,
          birthday: user.birthday ? moment(user.birthday) : null,
          area: user.area
        }));

        stateCopy.schedulerData.setResources(
          stateCopy.users
            .filter(user => user.area !== "office")
            .filter(user => stateCopy.absences.every(absence => absence.user.id !== user.id))
        );

        return stateCopy;
      });
    });

  getAllTasks = () =>
    getTasks().then(data => {
      this.setState({
        tasks: data.map(task => ({
          id: task.id,
          name: task.name,
          color: task.color
        }))
      });
    });

  getDayAbsences = schedulerData => {
    const date = new Date(schedulerData.startDate);
    getAbsences(undefined, date, date).then(data => {
      this.setState(stateCopy => {
        stateCopy.absences = data.map(absence => ({
          id: absence.id,
          date: absence.date,
          user: absence.user
        }));

        stateCopy.schedulerData.setResources(
          stateCopy.users
            .filter(user => user.area !== "office")
            .filter(user => stateCopy.absences.every(absence => absence.user.id !== user.id))
        );

        return stateCopy;
      });
    });
  };

  getDayEvents = schedulerData => {
    getEvents(new Date(schedulerData.startDate)).then(events => {
      //Receives the events from the server and transforms them into the scheduler format
      schedulerData.setEvents(
        events.map(event => ({
          id: event.id,
          title: event.task.name,
          start: event.start,
          end: event.end,
          resourceId: event.user.id,
          bgColor: event.task.color
        }))
      );

      this.setState({
        schedulerData
      });
    });
  };

  capStartTime = start => {
    const startMoment = moment(start);
    if (startMoment.hour() < 8) {
      startMoment.hour(8);
    }
    return startMoment.toISOString();
  };

  capEndTime = end => {
    const endMoment = moment(end);
    if (endMoment.hour() > 18) {
      endMoment.hour(18);
    }
    return endMoment.toISOString();
  };

  prevClick = schedulerData => {
    schedulerData.prev();

    this.getDayEvents(schedulerData);
    this.getDayAbsences(schedulerData);
  };

  nextClick = schedulerData => {
    schedulerData.next();

    this.getDayEvents(schedulerData);
    this.getDayAbsences(schedulerData);
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);

    schedulerData.config.creatable = !view.isEventPerspective;

    schedulerData.setEvents([]);

    this.setState({
      schedulerData
    });
  };

  onSelectDate = (schedulerData, date) => {
    schedulerData.setDate(date);

    this.getDayEvents(schedulerData);
    this.getDayAbsences(schedulerData);
  };

  eventItemClick = (schedulerData, event) => {
    deleteEvent(event.id).then(() => {
      schedulerData.removeEventById(event.id);

      this.setState({
        schedulerData
      });
    });
  };

  updateEventStart = (schedulerData, event, start) => {
    start = this.capStartTime(start);

    editEvent(event.id, start, undefined, undefined, undefined).then(() => {
      schedulerData.updateEventStart(event, start);

      this.setState({
        schedulerData
      });
    });
  };

  updateEventEnd = (schedulerData, event, end) => {
    end = this.capEndTime(end);

    editEvent(event.id, undefined, end, undefined, undefined).then(() => {
      schedulerData.updateEventEnd(event, end);

      this.setState({
        schedulerData
      });
    });
  };

  moveEvent = (schedulerData, event, resourceId, resourceName, start, end) => {
    start = this.capStartTime(start);
    end = this.capEndTime(end);

    editEvent(event.id, start, end, undefined, resourceId).then(() => {
      schedulerData.moveEvent(event, resourceId, resourceName, start, end);

      this.setState({
        schedulerData
      });
    });
  };

  newEvent = (schedulerData, resourceId, resourceName, start, end) => {
    start = this.capStartTime(start);
    end = this.capEndTime(end);

    if (this.state.activeTaskId === null) {
      message.error("You must select a task first.");
      return;
    }

    createEvent(start, end, this.state.activeTaskId, resourceId).then(event => {
      schedulerData.addEvent({
        id: event.id,
        title: event.task.name,
        start: event.start,
        end: event.end,
        resourceId: event.user.id,
        bgColor: event.task.color
      });

      this.setState({
        viewModel: schedulerData
      });
    });
  };

  conflictOccurred = (schedulerData, action, event, type, resourceId, resourceName, start, end) => {
    message.error(`${resourceName} already has a task scheduled for this slot.`);
  };

  toggleExpandFunc = (schedulerData, resourceId) => {
    console.log(`toggleExpandFunc {resourceId: ${resourceId}}`);

    schedulerData.toggleExpandStatus(resourceId);

    this.setState({
      schedulerData
    });
  };

  handleClickTask = taskId => {
    this.setState({
      activeTaskId: taskId
    });
  };

  render() {
    const birthdayUserNames = this.state.users
      .filter(user => {
        const date = moment(this.state.schedulerData.startDate);
        const birthday = moment(user.birthday);
        return date.month() === birthday.month() && date.date() === birthday.date();
      })
      .map(user => user.name);

    return (
      <>
        <Row justify="center">
          <Col span={4}>
            {birthdayUserNames.length > 0 && (
              <Alert message={`Happy birthday ${birthdayUserNames.join(" and ")}!`} type="info" />
            )}
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3} style={{ paddingTop: "76px" }}>
            <Affix offsetTop={24}>
              {this.state.tasks.map(task => (
                <div
                  key={task.id}
                  className="round-all event-item"
                  style={{
                    cursor: this.props.allowEdit ? "pointer" : "default",
                    height: "22px",
                    marginBottom: "12px",
                    backgroundColor: task.color,
                    boxShadow: task.id === this.state.activeTaskId && `0px 0px 12px 0px ${task.color}`,
                    transform: task.id === this.state.activeTaskId && "scale(1.05)"
                  }}
                  onClick={this.props.allowEdit ? () => this.handleClickTask(task.id) : null}
                >
                  <span style={{ marginLeft: "10px", lineHeight: "22px" }}>{task.name}</span>
                </div>
              ))}
            </Affix>
          </Col>
          <Col span={21}>
            <Scheduler
              schedulerData={this.state.schedulerData}
              prevClick={this.prevClick}
              nextClick={this.nextClick}
              onViewChange={this.onViewChange}
              onSelectDate={this.onSelectDate}
              eventItemClick={this.eventItemClick}
              updateEventStart={this.updateEventStart}
              updateEventEnd={this.updateEventEnd}
              moveEvent={this.moveEvent}
              newEvent={this.newEvent}
              conflictOccurred={this.conflictOccurred}
              toggleExpandFunc={this.toggleExpandFunc}
            />
          </Col>
        </Row>
      </>
    );
  }
}

export default WorkSchedule;
