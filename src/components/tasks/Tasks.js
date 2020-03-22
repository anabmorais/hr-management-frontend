import React, { Component } from "react";
import { Card, Typography } from "antd";
import TaskCard from "./TaskCard";
import { getTasks, deleteTask, createTask, editTask } from "../../api/tasks";

const ALL_COLORS = [
  "#255586",
  "#68c6d2",
  "#77acbb",
  "#bfdbf7",
  "#837d83",
  "#7a607d",
  "#dfc6dd",
  "#a42546",
  "#de5566",
  "#f69d88",
  "#ffcaaf",
  "#fff8a3",
  "#fff7df",
  "#ecceb7",
  "#c37756",
  "#916a64",
  "#456e75",
  "#8fa17a",
  "#ccf4d1",
  "#90beb1"
];

class Tasks extends Component {
  state = {
    tasks: [],
    availableColors: ALL_COLORS
  };

  componentDidMount() {
    this.getAllTasks();
  }

  getAllTasks = () =>
    getTasks().then(data => {
      this.setState(
        {
          tasks: data.map(task => ({
            key: task.id,
            name: task.name,
            color: task.color
          }))
        },
        //Callback after updating state
        this.refreshAvailableColors
      );
    });

  refreshAvailableColors = () => {
    this.setState(stateCopy => {
      stateCopy.availableColors = ALL_COLORS.reduce((accum, color) => {
        const task = stateCopy.tasks.find(task => task.color === color);

        if (!task) {
          accum.push(color);
        }

        return accum;
      }, []);

      return stateCopy;
    });
  };

  handleSubmitCreate = values =>
    createTask(values.name, values.color)
      .then(task => {
        this.setState(
          stateCopy => {
            stateCopy.tasks.push({
              key: task.id,
              name: task.name,
              color: task.color
            });

            return stateCopy;
          },
          //Callback after updating state
          this.refreshAvailableColors
        );
      })
      .catch(error => {});

  handleSubmitEdit = values =>
    editTask(values.key, values.name, values.color)
      .then(task => {
        this.setState(
          stateCopy => {
            const taskIndexToEdit = stateCopy.tasks.findIndex(task => task.key === values.key);

            if (taskIndexToEdit !== -1) {
              stateCopy.tasks[taskIndexToEdit] = {
                key: task.id,
                name: task.name,
                color: task.color
              };
            }

            return stateCopy;
          },
          //Callback after updating state
          this.refreshAvailableColors
        );
      })
      .catch(error => {});

  handleClickDelete = taskId =>
    deleteTask(taskId).then(() => {
      this.setState(
        stateCopy => {
          const taskIndexToRemove = stateCopy.tasks.findIndex(task => task.key === taskId);

          if (taskIndexToRemove !== -1) {
            stateCopy.tasks.splice(taskIndexToRemove, 1);
          }

          return stateCopy;
        },
        //Callback after updating state
        this.refreshAvailableColors
      );
    });

  render() {
    return (
      <>
        <Typography.Title level={3}>Tasks</Typography.Title>
        <Card>
          {this.state.tasks.map(task => (
            <TaskCard
              key={task.key}
              task={task}
              colors={this.state.availableColors}
              onClickDelete={() => this.handleClickDelete(task.key)}
              onClickSave={this.handleSubmitEdit}
            />
          ))}
          {this.state.tasks.length < 20 && (
            <TaskCard colors={this.state.availableColors} onClickSave={this.handleSubmitCreate} />
          )}
        </Card>
      </>
    );
  }
}

export default Tasks;
