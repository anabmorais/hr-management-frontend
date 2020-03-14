import React, { Component } from "react";
import { Card, Typography } from "antd";
import TaskCard from "./TaskCard";
import { getTasks, deleteTask, createTask, editTask } from "../../api/tasks";

class Tasks extends Component {
  state = {
    tasks: []
  };

  componentDidMount() {
    this.getAllTasks();
  }

  getAllTasks = () =>
    getTasks().then(data => {
      this.setState({
        tasks: data.map(task => ({
          key: task.id,
          name: task.name,
          color: task.color
        }))
      });
    });

  handleSubmitCreate = values =>
    createTask(values.name, values.color)
      .then(task => {
        this.setState(stateCopy => {
          stateCopy.tasks.push({
            key: task.id,
            name: task.name,
            color: task.color
          });

          return stateCopy;
        });
      })
      .catch(error => {});

  handleSubmitEdit = values =>
    editTask(values.key, values.name, values.color)
      .then(task => {
        this.setState(stateCopy => {
          const taskIndexToEdit = stateCopy.tasks.findIndex(task => task.key === values.key);

          if (taskIndexToEdit !== -1) {
            stateCopy.tasks[taskIndexToEdit] = {
              key: task.id,
              name: task.name,
              color: task.color
            };
          }
          return stateCopy;
        });
      })
      .catch(error => {});

  handleClickDelete = taskId =>
    deleteTask(taskId).then(() => {
      this.setState(stateCopy => {
        const taskIndexToRemove = stateCopy.tasks.findIndex(task => task.key === taskId);

        if (taskIndexToRemove !== -1) {
          stateCopy.tasks.splice(taskIndexToRemove, 1);
        }
        return stateCopy;
      });
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
              onClickDelete={() => this.handleClickDelete(task.key)}
              onClickSave={this.handleSubmitEdit}
            />
          ))}
          {this.state.tasks.length < 20 && <TaskCard onClickSave={this.handleSubmitCreate} />}
        </Card>
      </>
    );
  }
}

export default Tasks;
