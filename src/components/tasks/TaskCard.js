import React, { Component } from "react";
import { Card, Input } from "antd";
import { BgColorsOutlined, EditTwoTone, DeleteTwoTone, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { GithubPicker } from "react-color";

const NEW_TASK = {
  name: "",
  color: null
};

class TaskCard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditing: props.task === undefined,
      isVisibleColorPicker: false,
      task: props.task === undefined ? NEW_TASK : props.task
    };
  }

  handleClickColorPicker = () => {
    this.setState({ isVisibleColorPicker: true });
  };

  handleClickEdit = () => {
    this.setState({ isEditing: true, task: this.props.task });
  };

  handleClickCancel = () => {
    this.setState({
      isEditing: this.props.task === undefined ? true : false,
      isVisibleColorPicker: false,
      task: this.props.task === undefined ? NEW_TASK : this.props.task
    });
  };

  handleChangeName = event => {
    this.setState({
      task: { ...this.state.task, name: event.target.value }
    });
  };

  handleChangeColor = color => {
    this.setState({ task: { ...this.state.task, color: color.hex } });
  };

  renderViewingButtons() {
    return (
      <>
        <EditTwoTone style={{ marginRight: 18, fontSize: 20 }} onClick={this.handleClickEdit} />
        <DeleteTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 20 }} onClick={this.props.onClickDelete} />
      </>
    );
  }

  renderEditingButtons() {
    const canSave = this.state.task.name !== "" && this.state.task.color !== null;

    return (
      <>
        <CheckOutlined
          style={{ color: canSave ? "#73d13d" : "#d9d9d9", marginRight: 18, fontSize: 20 }}
          onClick={
            canSave
              ? () => {
                  this.props.onClickSave(this.state.task).then(() => {
                    if (this.props.task === undefined) {
                      // New task card - stay in edit mode but reset the fields
                      this.setState({
                        isVisibleColorPicker: false,
                        task: NEW_TASK
                      });
                    } else {
                      // Existing task card - leave edit mode
                      this.setState({
                        isEditing: false,
                        isVisibleColorPicker: false
                      });
                    }
                  });
                }
              : undefined
          }
        />
        <CloseOutlined style={{ color: "#ff4d4f", fontSize: 20 }} onClick={this.handleClickCancel} />
      </>
    );
  }

  renderColorPickerButton() {
    return (
      this.state.isEditing && (
        <BgColorsOutlined
          style={{ fontSize: 20 }}
          onClick={this.state.isEditing ? this.handleClickColorPicker : undefined}
        />
      )
    );
  }

  render() {
    return (
      <Card.Grid
        className="task-card"
        style={{ backgroundColor: this.state.isEditing ? this.state.task.color : this.props.task.color }}
      >
        <Input
          addonBefore={this.renderColorPickerButton()}
          addonAfter={this.state.isEditing ? this.renderEditingButtons() : this.renderViewingButtons()}
          size="large"
          placeholder="Task name"
          value={this.state.isEditing ? this.state.task.name : this.props.task.name}
          onChange={this.handleChangeName}
        />
        {this.state.isVisibleColorPicker && (
          <GithubPicker
            className="color-picker"
            colors={this.props.colors}
            width="262px"
            onChangeComplete={this.handleChangeColor}
          />
        )}
      </Card.Grid>
    );
  }
}

export default TaskCard;
