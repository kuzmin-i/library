import moment from "moment";
import { Modal, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

import { reachGoal } from "@/components/ym-counter";
import TakeBookRules from "../../public/assets/data/rules-take.md";

const counter = process.env.NEXT_PUBLIC_YM_COUNTER;

const { confirm } = Modal;
const { Paragraph, Text } = Typography;

const handleBookDialog = (isReturn, handleTransaction) => {
  if (isReturn) {
    const returnModal = confirm({
      title: "Вы точно хотите сдать книгу?",
      autoFocusButton: null,
      onOk: (close) => {
        returnModal.update({
          okButtonProps: { danger: true, loading: true },
        });
        handleTransaction()
          .then(() => {
            returnModal.update({
              title: "Вы успешно сдали книгу!",
              type: "success",
              okCancel: false,
              icon: <CheckCircleOutlined />,
              onOk: () => close(),
              okText: "Закрыть",
              cancelText: "Закрыть",
              okButtonProps: {
                danger: false,
                loading: false,
              },
            });

            reachGoal(counter, "returnBook");
          })
          .catch((err) => err && close());
      },
      okText: "Сдать",
      okButtonProps: { danger: true },
      maskClosable: true,
    });
  } else {
    const takeModal = confirm({
      title: <Text strong>Правила</Text>,
      type: "info",
      icon: null,
      width: 480,
      className: "take-modal",
      okText: "Подтвердить",
      cancelText: "Отменить",
      maskClosable: true,
      onOk: (close) => {
        takeModal.update({ okButtonProps: { loading: true } });
        handleTransaction()
          .then((res) => {
            const { data } = { ...res };
            const { takeBook } = { ...data };
            const { expires } = { ...takeBook };

            takeModal.update({
              title: "Вы успешно взяли книгу!",
              type: "success",
              className: false,
              okCancel: false,
              icon: <CheckCircleOutlined />,
              content:
                expires &&
                `Срок чтения — до ${moment(expires).format(
                  "LL"
                )} По истечении срока, пожалуйста, сдайте книгу.`,
              onOk: () => close(),
              okText: "Закрыть",
              okButtonProps: {
                loading: false,
              },
            });

            reachGoal(counter, "takeBook");
          })
          .catch((err) => err && close());
      },
      content: (
        <Paragraph>
          <TakeBookRules />
        </Paragraph>
      ),
    });
  }
};

export default handleBookDialog;
