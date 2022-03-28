import React from "react";
import { useQuery } from "@apollo/client";
import { AUTHORS_TAGS_QUERY } from "@/lib/apollo/admin_queries";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import stc from "string-to-color";

import styled from "styled-components";

import { Form, Input, Button, Select, Tag, Row, Col } from "antd";
const { Option } = Select;

const Btn = styled(Button)`
  &&& {
    padding: 4px 25px;
    height: 36px;
  }
`;

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

const MainSettings = ({
  name = "",
  about = "",
  authors: tags = [],
  setCurrentStep,
  setMainData,
  cr,
  id,
}) => {
  const { data = {}, loading, error } = useQuery(AUTHORS_TAGS_QUERY, {});
  const { authors } = { ...data };

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
          name={"name"}
          initialValue={name}
          label="Название книги"
          rules={[{ required: true }]}
        >
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name="about" initialValue={about} label="Описание книги">
          <Input.TextArea
            showCount
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder=""
          />
        </Form.Item>
        <Form.Item
          name="authors"
          rules={[{ required: true }]}
          initialValue={tags}
          label="Авторы"
        >
          {authors && (
            <Select
              mode="multiple"
              tagRender={tagRender}
              allowClear
              style={{ width: "100%" }}
              placeholder="Выберите авторов"
            >
              {authors.map(({ id, name }, i) => (
                <Option key={`authorOption:${i}`} value={id}>
                  {name}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>

        <Row justify="end">
          {/*<Col>
            <Btn>Назад</Btn>
          </Col>*/}
          <Col>
            <Form.Item>
              <Btn type="primary" htmlType="submit">
                Далее
              </Btn>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default MainSettings;
