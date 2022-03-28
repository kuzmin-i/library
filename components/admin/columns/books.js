import React from "react";
import styled from "styled-components";
import BookStatus from "../../book/book-status";

import BookImage from "@/components/book/book-image";

import {
  Image,
  Space,
  Typography,
  Popconfirm,
  message,
  notification,
} from "antd";
const { Paragraph } = Typography;

function imageExists(image_url) {
  var http = new XMLHttpRequest();

  http.open("HEAD", image_url, false);
  http.send();

  return http.status != 404;
}

const Text = styled(Paragraph)`
  margin-bottom: 0px;
`;

const ThumbWrapper = styled.div`
  width: 50px;
  height: 50px;
  background: lightgrey;
  overflow: hidden;
  position: relative;

  && > * {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%) translateY(-50%);
  }
`;

const openNotification = (placement) => {
  notification.success({
    message: `Успешно!`,
    description: "Книга удалена",
    placement,
  });
};

const bookColumns = [
  {
    title: "",
    width: 25,
    dataIndex: "thumb",
    key: "thumb",
    render: (e) => {
      const url = `${process.env.NEXT_PUBLIC_DOMAIN}/upload/thumb/${e}`;

      return (
        <ThumbWrapper>
          <BookImage
            width="50"
            height="50"
            alt=""
            objectFit="contain"
            objectPosition="center"
            src={url}
          />
        </ThumbWrapper>
      );
    },
  },
  {
    title: "Название",
    width: 100,
    dataIndex: "name",
    key: "name",
    render: (e) => <Text ellipsis={{ rows: 2 }}>{e}</Text>,
  },
  {
    title: "Авторы",
    width: 100,
    dataIndex: "authors",
    key: "authors",
    render: (e) => {
      return (
        e && (
          <Text ellipsis={{ rows: 2 }} style={{ color: "#616161" }}>
            {e.reduce((prevAuthor, { author }) => {
              const comma = prevAuthor === "" ? "" : ", ";
              return prevAuthor + comma + author.name;
            }, "")}
          </Text>
        )
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
    title: "Статус",
    width: 50,
    dataIndex: "state",
    key: "state",
    render: (e) => {
      return <BookStatus state={e} userId={e?.userId} loading={false} />;
    },
  },
  {
    title: "Действия",
    width: 50,
    dataIndex: "id",
    key: "action",
    render: (e, { editMode, setSelectedBookID, setNewRecord }) => {
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

            <Popconfirm
              title="Вы действительно хотите удалить книгу?"
              onConfirm={() => openNotification("bottomRight")}
              onCancel={() => console.log("Отменено")}
              okText="Да"
              cancelText="Нет"
            >
              <a>Удалить</a>
            </Popconfirm>
          </Space>
        </>
      );
    },
  },
];

export { bookColumns };
