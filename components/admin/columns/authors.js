import React from "react";
import styled from "styled-components";

import { Image, Space, Typography } from "antd";
const { Paragraph } = Typography;

import moment from "moment";
import stc from "string-to-color";

const Text = styled(Paragraph)`
  margin-bottom: 0px;
`;

const ThumbWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: ${({ color }) => (color ? color : "lightgrey")};
  filter: contrast(200%);
  opacity: .5;
  overflow: hidden;
  position: relative;

  && > * {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%) translateY(-50%);
  }
`;

const authorColumns = [
  {
    title: "",
    width: 25,
    dataIndex: "photo",
    key: "photo",
    render: (e, { id }) => (
      <ThumbWrapper color={stc(id)}>
        {e && <Image width={50} src={`${prodURL}/upload/thumb/${e}`} />}
      </ThumbWrapper>
    ),
  },
  {
    title: "Имя автора",
    width: 80,
    dataIndex: "name",
    key: "name",
    render: (e) => <Text ellipsis={{ rows: 2 }}>{e}</Text>,
  },
  {
    title: "Описание",
    width: 80,
    dataIndex: "about",
    key: "about",
    render: (e) => (
      <Text style={{ color: "#616161" }} ellipsis={{ rows: 2 }}>
        {e ? e : <i>(Описание отсутствует)</i>}
      </Text>
    ),
  },
  {
    title: "Книги",
    width: 40,
    dataIndex: "books_aggregate",
    key: "books_aggregate",
    render: (e) => {
      const { aggregate = {} } = e;
      const { count = 0 } = aggregate;

      return (
        <Text style={{ color: "#616161" }} ellipsis={{ rows: 1 }}>
          {count}
        </Text>
      );
    },
  },
  {
    title: "Дата добавления",
    width: 60,
    dataIndex: "cr",
    key: "cr",
    render: (e) => {
      return (
        <Text style={{ color: "#616161" }} ellipsis={{ rows: 2 }}>
          {moment().to(e)}
        </Text>
      );
    },
  },
  {
    title: "",
    width: 50,
    dataIndex: "",
    key: "gap1",
    render: () => <></>,
  },
  {
    title: "Действия",
    width: 50,
    dataIndex: "id",
    key: "action",
    render: (e, { editMode, setSelectedBookID }) => {
      return (
        <>
          <Space direction="vertical">
            <a
              onClick={() => {
                editMode(true);
                setSelectedBookID(e);
              }}
            >
              Изменить
            </a>
            <a>Удалить</a>
          </Space>
        </>
      );
    },
  },
];

export { authorColumns };
