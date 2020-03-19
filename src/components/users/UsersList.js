import React, { Component } from "react";
import { Table, Popconfirm } from "antd";
import { EditTwoTone, DeleteTwoTone, LockTwoTone } from "@ant-design/icons";

class UsersList extends Component {
  state = {
    filteredInfo: null,
    sortedInfo: null
  };

  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    });
  };

  render() {
    const { users, onClickEdit, onClickCredentials, onClickDelete } = this.props;

    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }
          return 0;
        },
        sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
        ellipsis: true
      },
      {
        title: "Birthdate",
        dataIndex: "birthday",
        key: "birthday",
        sorter: (a, b) => a.birthday - b.birthday,
        sortOrder: sortedInfo.columnKey === "birthday" && sortedInfo.order,
        render: birthday => (birthday ? birthday.format("DD-MM-YYYY") : "N/A")
      },
      {
        title: "Area",
        dataIndex: "area",
        key: "area",
        filters: [
          { text: "Factory", value: "factory" },
          { text: "Lids", value: "lids" },
          { text: "Office", value: "office" },
          { text: "Packaging", value: "packaging" },
          { text: "Presses", value: "presses" },
          { text: "Warehouse", value: "warehouse" }
        ],
        filteredValue: filteredInfo.area || null,
        onFilter: (value, record) => record.area.includes(value),
        sorter: (a, b) => {
          if (a.area.toLowerCase() < b.area.toLowerCase()) {
            return -1;
          }
          if (a.area.toLowerCase() > b.area.toLowerCase()) {
            return 1;
          }
          return 0;
        },
        sortOrder: sortedInfo.columnKey === "area" && sortedInfo.order,
        ellipsis: true
      },
      {
        title: "Action",
        dataIndex: "key",
        key: "action",
        render: userId => (
          <span>
            <EditTwoTone style={{ marginRight: 18, fontSize: 20 }} onClick={() => onClickEdit(userId)} />
            <LockTwoTone
              twoToneColor="#ffa940"
              style={{ marginRight: 18, fontSize: 20 }}
              onClick={() => onClickCredentials(userId)}
            />
             <Popconfirm placement="right" title="Are you sure to delete this user?" onConfirm={() => onClickDelete(userId)} okText="Yes" cancelText="No">
            <DeleteTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 20 }} />
            </Popconfirm>
          </span>
        )
      }
    ];

    return <Table columns={columns} dataSource={users} onChange={this.handleChange} />;
  }
}

export default UsersList;
