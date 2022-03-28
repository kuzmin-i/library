import { Button, Col, DatePicker, Grid, Form, Row, Select, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";

import { languages, orderBy } from "@/constants";
import CatalogsSelect from "@/components/books-catalog/catalogs-select";
import Key from "@/components/book/key";

const { useBreakpoint } = Grid;
const { Option } = Select;

const Filters = ({ authors, catalogs, onReset }) => {
  const { sm = true } = useBreakpoint();

  const authorsPlaceholder = "Все авторы";
  const catalogsPlaceholder = "Все разделы";
  const langPlaceholder = "Все языки";
  const orderByPlaceholder = "По умолчанию";

  const authorsDefaultValue = { label: authorsPlaceholder, value: "all" };
  const catalogsDefaultValue = {
    label: catalogsPlaceholder,
    value: "all",
    children: catalogsPlaceholder,
  };
  const langDefaultValue = { label: langPlaceholder, value: "all" };
  const orderByDefaultValue = {
    label: orderByPlaceholder,
    value: "default",
    children: orderByPlaceholder,
  };

  const authorsOptions = authors?.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
  const catalogsOptions = catalogs?.map(({ id, name, key }) => ({
    value: id,
    label: `${key} ${name}`,
    children: (
      <Space size={4}>
        {key && <Key style={{ fontSize: "1rem" }}>{`[${key}]`}</Key>}
        {name}
      </Space>
    ),
  }));

  const filterOption = (input, option) =>
    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;

  return (
    <>
      <Row gutter={16}>
        {authors && (
          <Col span={!sm && 24}>
            <Form.Item label="Автор" name="author">
              <Select
                {...{ filterOption }}
                placeholder={authorsPlaceholder}
                options={[authorsDefaultValue, ...authorsOptions]}
                style={{ ...(sm && { width: "10rem" }) }}
                showSearch
                allowClear
              />
            </Form.Item>
          </Col>
        )}
        <Col span={!sm && 24}>
          <Form.Item label="Год" name="year">
            <DatePicker
              picker="year"
              disabledDate={(current) =>
                current && current > moment().endOf("year")
              }
            />
          </Form.Item>
        </Col>
        <Col span={!sm && 24}>
          <Form.Item label="Язык" name="lang">
            <Select
              placeholder={langPlaceholder}
              options={[langDefaultValue, ...languages]}
              style={{ ...(sm && { width: "7.5rem" }) }}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={!sm && 24}>
          <Form.Item label="Сортировка" name="sort">
            <Select
              placeholder={orderByPlaceholder}
              style={{ ...(sm && { width: "9rem" }) }}
              allowClear
            >
              {[orderByDefaultValue, ...orderBy]?.map(({ value, ...rest }) => (
                <Option key={value} {...{ value, ...rest }} />
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      {catalogs && (
        <Row>
          <Col span={!sm && 24}>
            <Form.Item label="Раздел" name="catalog">
              {sm ? (
                <CatalogsSelect {...{ catalogs }} />
              ) : (
                <Select
                  {...{ filterOption }}
                  placeholder={catalogsPlaceholder}
                  showSearch
                >
                  {[catalogsDefaultValue, ...catalogsOptions]?.map(
                    ({ value, ...rest }) => (
                      <Option key={value} {...{ value, ...rest }} />
                    )
                  )}
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      )}
      <Row style={!sm && { marginTop: "auto" }}>
        <Col span={!sm && 24}>
          <Form.Item noStyle>
            <Button
              htmlType="reset"
              icon={<DeleteOutlined />}
              onClick={onReset}
              block={!sm}
            >
              Сбросить
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default Filters;
