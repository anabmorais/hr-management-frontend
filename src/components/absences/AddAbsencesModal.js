import React from "react";
import { Modal, Form, DatePicker, Select } from "antd";

const AddAbsencesModal = props => {
  const { visible, onSubmit, onCancel, users } = props;

  const [form] = Form.useForm();

  const handleOk = () => {
    form
      .validateFields()
      .then(onSubmit)
      .catch(console.error);
  };

  return (
    <Modal visible={visible} title="Add Absence" okText="Add" cancelText="Cancel" onOk={handleOk} onCancel={onCancel}>
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="userId" rules={[{ required: true, message: "Please input a user!" }]}>
          <Select>
            {users.map(user => (
              <Select.Option key={user.key} value={user.key}>
                {user.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="date" label="Absence Date" rules={[{ required: true, message: "Please input a date!" }]}>
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddAbsencesModal;
