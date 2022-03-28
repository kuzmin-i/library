import { Tag, Typography } from "antd";
import {
  CheckCircleFilled,
  ClockCircleFilled,
  CloseCircleFilled,
  QuestionCircleFilled,
  SyncOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Text } = Typography;

const BookTag = styled(Tag)`
  display: flex;
  align-items: center;
  padding: 0;
  border: 0;
  background-color: transparent;
  font-size: 0.875rem;
  white-space: normal;

  &.ant-tag-default {
    color: var(--color-grey-dark);
  }

  > span:not(.anticon) {
    max-width: calc(100% - 1.3125rem);
    color: var(--color-black);

    .ant-typography {
      max-width: 100%;
    }
  }
`;

const BookStatus = ({ state, userId, loading }) => {
  const { op_code = 0, user } = { ...state };
  const { id: bookUserId, meta } = { ...user };
  const [{ first_name, last_name }] = meta || [{}];
  const name =
    (first_name || last_name) &&
    `${first_name || ""}${first_name && last_name && " "}${last_name || ""}`;
  const isMyBook = op_code === 1 && bookUserId === userId;

  const statuses = {
    0: {
      icon: <CheckCircleFilled />,
      color: "success",
      children: "На полке",
    },
    1: {
      icon: <CloseCircleFilled />,
      color: "default",
      children: `На руках у ${name}`,
    },
    my: {
      icon: <ClockCircleFilled />,
      color: "warning",
      children: "В моих книгах",
    },
    load: {
      icon: <SyncOutlined spin />,
      color: "processing",
      children: "Обновление...",
    },
    def: {
      icon: <QuestionCircleFilled />,
      color: "default",
      children: "Неизвестно",
    },
  };

  const { [isMyBook ? "my" : op_code]: bookStatus, load, def } = {
    ...statuses,
  };
  const { children, ...rest } = { ...(loading ? load : bookStatus || def) };

  return (
    <BookTag {...rest}>
      <Text ellipsis>{children}</Text>
    </BookTag>
  );
};

export default BookStatus;
