import styled from "styled-components";
import { Button, Drawer, Form } from "antd";

import Filters from "@/components/books-catalog/filters";

const FiltersDrawer = styled(Drawer)`
  .ant-form {
    display: flex;
    flex-direction: column;
    height: 100%;

    .ant-row:last-child {
      margin-top: auto;
    }
  }
`;

const MobileFilters = ({
  visible,
  form,
  initialValues,
  authors,
  catalogs,
  onClose,
  onFinish,
}) => {
  const { submit } = { ...form };

  return (
    <FiltersDrawer
      {...{ visible, onClose }}
      title="Фильтры"
      width="100%"
      footer={
        <Button
          type="primary"
          onClick={() => {
            submit();
            onClose();
          }}
          block
        >
          Применить
        </Button>
      }
    >
      <Form
        {...{ form, initialValues, onFinish }}
        layout="vertical"
        name="filters"
      >
        <Filters {...{ authors, catalogs }} />
      </Form>
    </FiltersDrawer>
  );
};

export default MobileFilters;
