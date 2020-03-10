import React, { Component } from "react";
import { Layout, Menu, Breadcrumb } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ScheduleOutlined, ControlOutlined, UserOutlined } from "@ant-design/icons";
import WorkSchedule from "./WorkSchedule";
import Tasks from "./Tasks";
import Absences from "./absences/Absences";
import Users from "./users/Users";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// https://gist.github.com/VesperDev/e233115469a6c53bb96443f66385aa22
class Main extends Component {
  state = {
    collapsed: false
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  render() {
    return (
      <Router>
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
            <div className="logo">Logo</div>
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
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
              </Breadcrumb>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Route path="/work-schedule">
                  <WorkSchedule />
                </Route>
                <Route path="/tasks">
                  <Tasks />
                </Route>
                <Route exact path="/users">
                  <Users />
                </Route>
                <Route path="/users/absences">
                  <Absences />
                </Route>
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>2020 Created by Ana Morais</Footer>
          </Layout>
        </Layout>
      </Router>
    );
  }
}

export default Main;
