import React from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";

const CreateEditUserModal = props => {
  const { visible, onSubmit, onCancel, user } = props;

  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(onSubmit)
      .catch(console.error);
  };

  return (
    <Modal
      visible={visible}
      title={user ? "Edit user" : "Create a new user"}
      okText={user ? "Edit" : "Create"}
      cancelText="Cancel"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" initialValues={user}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input the name of the user!"
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="birthday"
          label="Birthdate"
          rules={[
            {
              required: true,
              message: "Please input the birthdate of the user!"
            },
            {
              validator: (rule, value) => {
                if (!value || value < new Date()) {
                  return Promise.resolve();
                }
                return Promise.reject("Please input a valid birthdate!");
              }
            }
          ]}
        >
          <DatePicker />
        </Form.Item>
        <Form.Item
          name="area"
          label="Area"
          rules={[
            {
              required: true,
              message: "Please select an area!"
            }
          ]}
        >
          <Select>
            <Select.Option value="factory">Factory</Select.Option>
            <Select.Option value="lids">Lids</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            <Select.Option value="packaging">Packaging</Select.Option>
            <Select.Option value="presses">Presses</Select.Option>
            <Select.Option value="warehouse">Warehouse</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateEditUserModal;
