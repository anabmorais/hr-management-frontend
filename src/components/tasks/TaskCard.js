import React, { Component } from "react";
import { GithubPicker } from "react-color";
import { Card, Button, Input } from "antd";
import { BgColorsOutlined, EditTwoTone, DeleteTwoTone, CheckOutlined, CloseOutlined } from "@ant-design/icons";

class TaskCard extends Component {
  static colors = [
    "#255586",
    "#68C6D2",
    "#77ACBB",
    "#BFDBF7",
    "#837D83",
    "#7A607D",
    "#DFC6DD",
    "#A42546",
    "#DE5566",
    "#F69D88",
    "#FFCAAF",
    "#FFF8A3",
    "#FFF7DF",
    "#ECCEB7",
    "#C37756",
    "#916A64",
    "#456E75",
    "#8FA17A",
    "#CCF4D1",
    "#90BEB1"
  ];

  state = {
    isEditing: false,
    isVisibleColorPicker: false
  };

  handleClickEdit = () => {
    this.setState({ isEditing: true });
  };

  handleClickCancel = () => {
    this.setState({
      isEditing: false,
      isVisibleColorPicker: false
    });
  };

  handleChangeComplete = color => {
    this.setState({ background: color.hex });
  };

  handleClickColorPicker = () => {
    this.setState({ isVisibleColorPicker: true });
  };

  render() {
    const { task } = this.props;
    console.log(task.color);
    return (
      <Card.Grid className="task-card" style={{ backgroundColor: `#${task.color}` }}>
        <Input
          addonBefore={
            <BgColorsOutlined style={{ fontSize: 20 }} onClick={this.state.isEditing && this.handleClickColorPicker} />
          }
          addonAfter={
            this.state.isEditing ? (
              <>
                <CheckOutlined style={{ color: "#73d13d", marginRight: 18, fontSize: 20 }} onClick={() => {}} />
                <CloseOutlined style={{ color: "#ff4d4f", fontSize: 20 }} onClick={this.handleClickCancel} />
              </>
            ) : (
              <>
                <EditTwoTone style={{ marginRight: 18, fontSize: 20 }} onClick={this.handleClickEdit} />
                <DeleteTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 20 }} onClick={() => {}} />
              </>
            )
          }
          size="large"
          placeholder="Task name"
          value={task.name}
        />
        {this.state.isVisibleColorPicker && (
          <GithubPicker
            className="color-picker"
            colors={TaskCard.colors}
            width="262px"
            onChangeComplete={this.handleChangeComplete}
          />
        )}
      </Card.Grid>
    );
  }
}

export default TaskCard;
