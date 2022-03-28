import React from "react";
import stc from "string-to-color";
import { Form, Input, Button, Tag } from "antd";

/* рендер тега */
function tagRender(props) {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      color={stc(value)}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
}

const MainSettings = ({ name = "", setCurrentStep }) => {
  const handleForm = (_, values) => {
    setMainData({ ...values, cr, id });
  };

  return (
    <>
      <Form
        name="mainSettings"
        onValuesChange={handleForm}
        onFinish={() => setCurrentStep(1)}
      >
        <Form.Item
          name="name"
          rules={[{ required: true }]}
          initialValue={name}
          label="Название издательства"
        >
          <Input placeholder="" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Далее
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default MainSettings;
