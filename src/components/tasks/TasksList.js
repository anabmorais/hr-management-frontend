import React, { Component } from "react";
import { Card } from 'antd';
import TaskCard from "./TaskCard";
import { getTasks } from "../../api/tasks";




class TasksList extends Component {

    state={
tasks: [],
    };

  getAllTasks = () =>
    getTasks().then(data => {
      this.setState({
        tasks: data.map(task => ({
          key: task.id,
          name: task.name,
          color: task.color,
        }))
      });
    });

  componentDidMount() {
    this.getAllTasks();
  }

  render() {
    
    return <div>
    
  <Card title="List of tasks">
  {this.state.tasks.map(task => (<TaskCard key={task.key} task={task}/>
  ))}
  {this.state.tasks.length<20 && <TaskCard task={{}}/>}

  </Card>
    </div>;
  }
}

export default TasksList;