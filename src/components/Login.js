import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { Form, Input, Button, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { loginUser } from "../api/users";
import { setToken } from "../utils/auth";
import { Card } from "antd";

// https://reacttraining.com/react-router/web/example/auth-workflow
class Login extends Component {
  state = {
    errorMessage: null
  };

  handleFinish = values => {
    const { location, history } = this.props;

    const { from } = location.state || { from: { pathname: "/" } };

    this.setState({
      errorMessage: null
    });

    loginUser(values.username, values.password)
      .then(data => {
        setToken(data.token);
        history.replace(from);
      })
      .catch(err => {
        if (err.message.includes("401")) {
          this.setState({
            errorMessage: "Invalid username or password."
          });
        } else {
          this.setState({
            errorMessage: "An error has occurred."
          });
        }
      });
  };

  handleValuesChange = () => {
    this.setState({
      errorMessage: null
    });
  };

  render() {
    return (
      <div className="site-card-wrapper" align="center">
        <Card title="Login" bordered={false} className="login-card">
          {this.state.errorMessage && <Alert message={this.state.errorMessage} type="error" showIcon />}
          <Form
            name="normal_login"
            className="login-form"
            onFinish={this.handleFinish}
            onValuesChange={this.handleValuesChange}
          >
            <Form.Item name="username" rules={[{ required: true, message: "Please input your Username!" }]}>
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
              <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="Password" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
              <Button type="primary" className="login-form-button">
                <Link to={"/work-schedule-overview"}>View the planning</Link>
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    );
  }
}

// https://reacttraining.com/react-router/web/api/withRouter
// withRouter to inject location and history into this.props
export default withRouter(Login);
