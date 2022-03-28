import React from "react";
import { useQuery } from "@apollo/client";
import { AUTHORS_TAGS_QUERY } from "@/lib/apollo/admin_queries";

import stc from "string-to-color";

import styled from "styled-components";

import { Form, Input, Button, Select, Tag, notification } from "antd";
const { Option } = Select;

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

const MainSettings = ({ name = "", about = "", setCurrentStep }) => {
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
          label="Имя автора"
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name="about" initialValue={about} label="Об авторе">
          <Input.TextArea
            showCount
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder=""
          />
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
