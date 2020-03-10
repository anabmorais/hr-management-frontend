import React from "react";
import { Modal, Form, Input} from "antd";

const EditCredentialsModal = props => {
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
      title="Edit credentials"
      okText="Edit"
      cancelText="Cancel"
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" initialValues={user}>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCredentialsModal;
