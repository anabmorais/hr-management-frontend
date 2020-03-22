import React, { Component } from "react";
import { message, Typography, Card } from "antd";
import Scheduler, { SchedulerData, ViewTypes, CellUnits, DATE_FORMAT } from "react-big-scheduler";
import moment from "moment";
import { getUsers } from "../api/users";
import { getTasks } from "../api/tasks";

moment.locale("pt-pt");

const events = [
  {
    id: 1,
    start: "2017-12-18 09:30:00",
    end: "2017-12-19 23:30:00",
    resourceId: "r1",
    title: "I am finished",
    bgColor: "#D9D9D9"
  },
  {
    id: 2,
    start: "2017-12-18 12:30:00",
    end: "2017-12-26 23:30:00",
    resourceId: "r2",
    title: "I am not resizable",
    resizable: false
  },
  {
    id: 3,
    start: "2017-12-19 12:30:00",
    end: "2017-12-20 23:30:00",
    resourceId: "r3",
    title: "I am not movable",
    movable: false
  },
  {
    id: 4,
    start: "2017-12-19 14:30:00",
    end: "2017-12-20 23:30:00",
    resourceId: "r1",
    title: "I am not start-resizable",
    startResizable: false
  },
  {
    id: 5,
    start: "2017-12-19 15:30:00",
    end: "2017-12-20 23:30:00",
    resourceId: "r2",
    title: "R2 has recurring tasks every week on Tuesday, Friday",
    bgColor: "#f759ab"
  }
];

class WorkSchedule extends Component {
  constructor(props) {
    super(props);

    const schedulerData = new SchedulerData(
      new moment().format(DATE_FORMAT),
      ViewTypes.Day,
      false,
      false,
      {
        schedulerWidth: 1400,
        dayResourceTableWidth: 150,
        dayCellWidth: 125,
        dayStartFrom: 8,
        dayStopTo: 17,
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

    schedulerData.setEvents(events);

    this.state = {
      users: [],
      tasks: [],
      schedulerData,
      activeTaskId: null
    };
  }

  componentDidMount() {
    this.getAllUsers();
    this.getAllTasks();
  }

  getAllUsers = () =>
    getUsers().then(data => {
      this.setState(
        {
          users: data.map(user => ({
            id: user.id,
            username: user.username,
            name: user.name,
            birthday: user.birthday ? moment(user.birthday) : null,
            area: user.area
          }))
        },
        () => this.state.schedulerData.setResources(this.state.users)
      );
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

  prevClick = schedulerData => {
    // Goes back 1 day
    console.log("prevClick");

    schedulerData.prev();

    schedulerData.setEvents(events);

    this.setState({
      schedulerData
    });
  };

  nextClick = schedulerData => {
    // Goes forward 1 day
    console.log("nextClick");

    schedulerData.next();

    schedulerData.setEvents(events);

    this.setState({
      schedulerData
    });
  };

  onViewChange = (schedulerData, view) => {
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);

    schedulerData.config.creatable = !view.isEventPerspective;

    schedulerData.setEvents(events);

    this.setState({
      schedulerData
    });
  };

  onSelectDate = (schedulerData, date) => {
    // TODO: Go to server and fetch the work schedule for the date selected
    console.log(`onSelectDate {date: ${date}}`);

    schedulerData.setDate(date);

    schedulerData.setEvents(events);

    this.setState({
      schedulerData
    });
  };

  eventClicked = (schedulerData, event) => {
    // THIS HAPPENS WHEN AN EVENT IS CLICKED - PURPOSE?!?
    console.log(`eventClicked {id: ${event.id}, title: ${event.title}}`);

    schedulerData.removeEventById(event.id);

    this.setState({
      schedulerData
    });
  };

  newEvent = (schedulerData, userId, slotName, start, end, type, item) => {
    // TO CREATE NEW EVENT - MUST SELECT TASK?!?!
    // SYNC TO SERVER slot
    console.log(
      `newEvent {userId: ${userId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`
    );

    let newFreshId = 0;

    schedulerData.events.forEach(item => {
      if (item.id >= newFreshId) newFreshId = item.id + 1;
    });

    let newEvent = {
      id: newFreshId,
      title: "New event you just created",
      start: start,
      end: end,
      resourceId: userId,
      bgColor: "purple"
    };

    schedulerData.addEvent(newEvent);

    this.setState({
      viewModel: schedulerData
    });
  };

  updateEventStart = (schedulerData, event, newStart) => {
    // EVENT WAS MOVED
    // SYNC TO SERVER
    console.log(`updateEventStart {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`);
    schedulerData.updateEventStart(event, newStart);

    this.setState({
      schedulerData
    });
  };

  updateEventEnd = (schedulerData, event, newEnd) => {
    // EVENT WAS MOVED
    // SYNC TO SERVER
    console.log(`updateEventEnd {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`);

    schedulerData.updateEventEnd(event, newEnd);

    this.setState({
      schedulerData
    });
  };

  moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    console.log(
      `moveEvent {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`
    );

    schedulerData.moveEvent(event, slotId, slotName, start, end);

    this.setState({
      schedulerData
    });
  };

  conflictOccurred = (schedulerData, action, event, type, slotId, slotName, start, end) => {
    message.error(`${slotName} already has a task scheduled for this slot!`);
  };

  toggleExpandFunc = (schedulerData, slotId) => {
    console.log(`toggleExpandFunc {slotId: ${slotId}}`);

    schedulerData.toggleExpandStatus(slotId);

    this.setState({
      schedulerData
    });
  };

  render() {
    return (
      <>
        <Typography.Title level={3}>Work Schedule</Typography.Title>
        <Card>
          <Scheduler
            schedulerData={this.state.schedulerData}
            prevClick={this.prevClick}
            nextClick={this.nextClick}
            onViewChange={this.onViewChange}
            onSelectDate={this.onSelectDate}
            eventItemClick={this.eventClicked}
            updateEventStart={this.updateEventStart}
            updateEventEnd={this.updateEventEnd}
            moveEvent={this.moveEvent}
            newEvent={this.newEvent}
            conflictOccurred={this.conflictOccurred}
            toggleExpandFunc={this.toggleExpandFunc}
          />
        </Card>
      </>
    );
  }
}

export default WorkSchedule;
