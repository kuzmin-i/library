import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";
import { PUBLISHERS_CATALOGS_TAGS_QUERY } from "@/lib/apollo/admin_queries";

import { languages } from "@/constants/languages";

import stc from "string-to-color";

import { Form, Input, InputNumber, Button, Select, Tag, Col, Row } from "antd";
const { Option } = Select;

const Btn = styled(Button)`
  &&& {
    padding: 4px 25px;
    height: 36px;
  }
`;

const FormOuterWrapper = styled.div`
  width: 100%;
  height: calc(100% - 50px);
  overflow: scroll;
  position: relative;

  &&::after {
    content: "";
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 5.21%,
      #ffffff 68.23%
    );
    width: 100%;
    height: 100px;
    position: absolute;
    bottom: 0;
    z-index: 1;
    pointer-events: none;
  }
`;

const FormWrapper = styled.div`
  position: absolute;
  width: 100%;
  max-height: 100%;
  overflow: scroll;
  padding-bottom: 50px;
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

const DetailsSettings = ({
  catalogs: localCatalogs,
  lang,
  isbn,
  year,
  publishers: localPublishers = [],
  setCurrentStep,
  first_publish_year,
  pages,
  url,
  setSettingsData,
}) => {
  const { data = {}, loading, error } = useQuery(
    PUBLISHERS_CATALOGS_TAGS_QUERY,
    {}
  );
  const { publishers = [], catalogs = [] } = { ...data };

  const handleForm = (_, values) => {
    setSettingsData(values);
  };

  return (
    <>
      <Form
        layout="vertical"
        style={{ height: "100%" }}
        onValuesChange={handleForm}
        onFinish={() => setCurrentStep(2)}
      >
        <FormOuterWrapper>
          <FormWrapper>
            <Form.Item
              name="catalogs"
              rules={[{ required: true }]}
              initialValue={localCatalogs}
              label="Раздел"
            >
              {catalogs && (
                <Select
                  mode="multiple"
                  tagRender={tagRender}
                  style={{ width: "100%" }}
                  allowClear
                  placeholder="Выберите категорию"
                >
                  {catalogs.map(({ id, name }, i) => (
                    <Option key={`catalogs:${i}`} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item name="lang" initialValue={lang} label="Язык">
              {languages && (
                <Select
                  mode="multiple"
                  tagRender={tagRender}
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Выберите язык"
                >
                  {languages.map(({ value, label }, i) => (
                    <Option key={`languages:${i}`} value={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item name="isbn" initialValue={isbn} label="ISBN">
              <Input placeholder="" />
            </Form.Item>

            <Form.Item
              name="publishers"
              initialValue={localPublishers}
              rules={[{ required: true }]}
              label="Издательство"
            >
              {publishers && (
                <Select
                  mode="multiple"
                  tagRender={tagRender}
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Выберите издательства"
                >
                  {publishers.map(({ id, name }, i) => (
                    <Option key={`publishers:${i}`} value={id}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              name="year"
              rules={[{ type: "number" }]}
              initialValue={year}
              label="Год"
            >
              <InputNumber placeholder="" />
            </Form.Item>

            <Form.Item
              name="first_publish_year"
              rules={[{ type: "number" }]}
              initialValue={first_publish_year}
              label="Год первого издания"
            >
              <InputNumber placeholder="" />
            </Form.Item>

            <Form.Item
              name="pages"
              initialValue={pages}
              rules={[{ type: "number" }]}
              label="Количество страниц"
            >
              <InputNumber placeholder="" />
            </Form.Item>

            <Form.Item
              name="url"
              initialValue={url}
              rules={[{ type: "url" }]}
              label="Ссылка на электронную версию"
            >
              <Input placeholder="" />
            </Form.Item>
          </FormWrapper>
        </FormOuterWrapper>

        <Row justify="space-between">
          <Col>
            <Btn onClick={() => setCurrentStep(0)}>Назад</Btn>
          </Col>
          <Form.Item>
            <Btn type="primary" htmlType="submit">
              Далее
            </Btn>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
};

export default DetailsSettings;
