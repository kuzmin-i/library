import React, { useEffect, useState } from "react";
import styled from "styled-components";

import Container, { PageContainer } from "@/components/layout/container";
import { Input, Button, Space, Form, Dropdown, Menu, Typography } from "antd";

import {
  SettingOutlined,
  DownOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Paragraph } = Typography;

const WorkPanel = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 50%);

  height: 80px;

  z-index: 100%;
`;

const InfoPanel = styled.div`
  height: 30px;
  background: white;
  color: black;

  box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.2);

  display: flex;
  align-items: center;

  padding: 26px 15px;
  min-width: max-content;
`;

const AddBook = styled(Button)`
  height: 45px;
  background: #5d5fef;
  border: 0px;

  &[disabled] {
    background: #e1e0e7;
  }

  &:hover,
  &:focus {
    background: #5052cf;
  }

  & span {
    font-size: 18px;
    color: white;
    padding-left: 18px;
    padding-right: 18px;
  }
`;

const WorkContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CustomSearch = styled(Search)`
  && button {
    background: #5d5fef;
    border: 0px;
    color: white;

    & * {
      color: white;
    }
  }
`;

const FormItem = styled(Form.Item)`
  &&.ant-form-item {
    margin-bottom: 0;
  }
`;

const CustomMenu = styled(Menu)`
  transform: translate(-15px, -15px);
  min-width: 200px;

  && {
    box-shadow: 0px 0px 20px 2px rgba(0, 0, 0, 0.2);
  }

  && .ant-menu-item:hover {
    & * {
      color: #5052cf;
    }
  }

  && .ant-menu-item-selected {
    background: none;

    & * {
      color: #5d5fef;
      font-weight: 500;
    }
  }
`;

/* выпадающий список секций */
const Sections = ({ section, setSection }) => (
  <CustomMenu>
    <Menu.Item>
      <a onClick={() => setSection("books")}>Книги</a>
    </Menu.Item>
    <Menu.Item>
      <a onClick={() => setSection("authors")}>Авторы</a>
    </Menu.Item>
    <Menu.Item>
      <a onClick={() => setSection("publishers")}>Издательства</a>
    </Menu.Item>
  </CustomMenu>
);

const FilterButton = ({ openFilterPanel }) => (
  <SettingOutlined
    onClick={(e) => {
      e.stopPropagation();
      openFilterPanel(true);
    }}
    style={{
      fontSize: 16,
      color: "black",
    }}
  />
);

const VR = styled.div`
  width: 1px;
  height: 20px;
  margin-left: 15px;
  margin-right: 15px;
  background: #e1e0e7;
`;

const CustomDropdown = styled(Dropdown)`
  width: max-content;
  display: flex;
  align-items: center;
  cursor: pointer;

  && * {
    transition: all 0.3s ease-in-out;
  }

  &&:hover * {
    color: #5d5fef;
  }
`;

const DropLabel = styled(Paragraph)`
  && {
    margin-bottom: 0;
    min-width: 100px;
    max-width: 100px;
  }
`;

const sectionsData = {
  books: {
    label: "Книги",
    add: "Добавить книгу",
  },
  authors: {
    label: "Авторы",
    add: "Добавить авторов",
  },
  publishers: {
    label: "Издательства",
    add: "Добавить издательства",
  },
};

const BottomPanel = ({
  total = 0,
  add,
  addAuthor,
  addPublisher,
  openFilterPanel,
  section,
  setSection,
  setNewRecord,
}) => {
  const [addBtn, setAddBtn] = useState(false);

  /* статус готовности кнопки "Добавить..." */
  useEffect(() => {
    setAddBtn(false);
    const time = setTimeout(() => setAddBtn(true), 1400);
    return () => {
      clearTimeout(time);
    };
  }, [section]);

  return (
    <WorkPanel>
      <Container style={{ height: "100%" }}>
        <WorkContent>
          <Space>
            <InfoPanel>
              <CustomDropdown
                overlay={<Sections {...{ section, setSection }} />}
                trigger={["hover"]}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  style={{ fontSize: "18px", fontWeight: "700" }}
                >
                  <DropLabel ellipsis={{ rows: 1 }}>
                    {sectionsData[section].label}
                  </DropLabel>{" "}
                  <DownOutlined />
                </div>
              </CustomDropdown>
            </InfoPanel>

            <InfoPanel>
              <div>Количество: {total} </div>

              <VR />
              <FormItem name="query">
                <CustomSearch
                  placeholder="Введите название"
                  allowClear
                  suffix={<FilterButton {...{ openFilterPanel }} />}
                />
              </FormItem>
            </InfoPanel>
          </Space>

          <AddBook
            disabled={!addBtn}
            onClick={() => {
              switch (section) {
                case "books":
                  return add(true);
                case "authors":
                  return addAuthor(true);
                case "publishers":
                  return addPublisher(true);
              }
            }}
          >
            {addBtn ? (
              <span>{sectionsData[section].add}...</span>
            ) : (
              <LoadingOutlined />
            )}
          </AddBook>
        </WorkContent>
      </Container>
    </WorkPanel>
  );
};

export default BottomPanel;
