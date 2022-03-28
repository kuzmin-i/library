import React from "react";
import styled from "styled-components";

import stc from "string-to-color";

import {
  LoadingOutlined,
} from "@ant-design/icons";

import { Form, Button, Select, Tag, Row, Col } from "antd";
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

const TagsSettings = ({
  setCurrentStep,
  handleForm: finishForm,
  tags,
  setTagsData,
  readyButton,
  setReadyButton,
}) => {
  const handleForm = (_, values) => {
    const { tags: originTags, ...otherFields } = values;
    let tags;
    if (originTags && originTags.length > 0)
      tags = originTags.reduce((prevTag, currTag) => `${prevTag},${currTag}`);

    setTagsData({ tags, ...otherFields });
  };

  const tagsToArray = (string) => {
    if (string) {
      const arr = string.split(",");

      if (arr.length > 0) {
        return arr;
      } else {
        return null;
      }
    }

    return null;
  };

  const formattedTags = tagsToArray(tags);

  return (
    <>
      <Form onValuesChange={handleForm} onFinish={finishForm}>
        <Form.Item
          name="tags"
          {...(formattedTags ? { initialValue: formattedTags } : null)}
          label="Теги"
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            tagRender={tagRender}
            placeholder="Пропишите ключевые слова, помогающие поиску книги"
          ></Select>
        </Form.Item>

        <Row justify="space-between">
          <Col>
            <Btn onClick={() => setCurrentStep(1)}>Назад</Btn>
          </Col>
          <Col>
            <Form.Item>
              <Btn
                disabled={readyButton === "loading" && true}
                type="primary"
                htmlType="submit"
              >
                {readyButton !== "loading" ? (
                  <>Сохранить</>
                ) : (
                  <LoadingOutlined />
                )}
              </Btn>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default TagsSettings;

/* onClick={() => {
              set(false);
              openNotification("bottomRight");
            }}*/
