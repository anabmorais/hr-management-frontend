import React, { Component } from "react";
import { Layout, Menu, Button } from "antd";
import { BrowserRouter as Router, Route, Switch, Link, withRouter } from "react-router-dom";
import { ScheduleOutlined, ControlOutlined, UserOutlined, LogoutOutlined } from "@ant-design/icons";
import WorkSchedule from "./WorkSchedule";
import Tasks from "./tasks/Tasks";
import Absences from "./absences/Absences";
import Users from "./users/Users";
import { removeToken } from "../utils/auth";
import icon from "../images/taskphase_icon.png";
import logo from "../images/taskphase.png";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// https://gist.github.com/VesperDev/e233115469a6c53bb96443f66385aa22
class Main extends Component {
  state = {
    collapsed: false
  };

  handleCollapse = collapsed => {
    this.setState({ collapsed });
  };

  handleClickLogout = () => {
    removeToken();
    this.props.history.push("/");
  };

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.handleCollapse}>
            <div style={{ padding: "16px", height: "64px", textAlign: "center" }}>
              <img src={this.state.collapsed ? icon : logo} alt="logo" style={{ height: "32px" }} />
            </div>
            <Menu theme="dark" defaultSelectedKeys={["3"]} mode="inline">
              <Menu.Item key="work-schedule">
                <ScheduleOutlined />
                <span>Work Schedule</span>
                <Link to="/work-schedule" />
              </Menu.Item>
              <Menu.Item key="tasks">
                <ControlOutlined />
                <span>Tasks</span>
                <Link to="/tasks" />
              </Menu.Item>
              <SubMenu
                key="users"
                title={
                  <span>
                    <UserOutlined />
                    <span>Users</span>
                  </span>
                }
              >
                <Menu.Item key="management">
                  <span>Management</span>
                  <Link to="/users" />
                </Menu.Item>
                <Menu.Item key="absences">
                  <span>Absences</span>
                  <Link to="/users/absences" />
                </Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header
              className="site-layout-background"
              style={{ padding: "24px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}
            >
              <Button type="primary" icon={<LogoutOutlined />} onClick={this.handleClickLogout}>
                Logout
              </Button>
            </Header>
            <Content style={{ margin: "24px" }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Switch>
                  <Route exact path={["/", "/work-schedule"]}>
                    <WorkSchedule />
                  </Route>
                  <Route exact path="/tasks">
                    <Tasks />
                  </Route>
                  <Route exact path="/users">
                    <Users />
                  </Route>
                  <Route exact path="/users/absences">
                    <Absences />
                  </Route>
                </Switch>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>2020 Created by Ana Morais</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default withRouter(Main);
