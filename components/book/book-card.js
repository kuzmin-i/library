import Link from "next/link";
import { Col, Grid, Row, Space, Typography } from "antd";
import styled from "styled-components";

import { arrToString } from "@/lib/helpers";
import BookStatus from "@/components/book/book-status";
import BookCardContainer from "@/components/book/book-card-container";
import CatalogsKeys from "@/components/book/catalogs-keys";
import BookImage from "@/components/book/book-image";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Container = styled(BookCardContainer)`
  .ant-space-vertical .ant-space-item:nth-child(2) {
    flex-shrink: 0;
  }
`;

const BookCard = ({ authors, id, thumb, name, catalogs, state, userId }) => {
  const { sm = true } = useBreakpoint();

  return (
    <Container bordered={false}>
      <Link href={`/book/${id}`}>
        <a>
          <Row gutter={[16, 8]}>
            <Col span={10} sm={24}>
              <Space direction="vertical">
                {sm && <BookStatus {...{ state, userId }} />}
                <BookImage
                  src={`${process.env.NEXT_PUBLIC_DOMAIN}/upload/thumb/${thumb}`}
                  alt={name || ""}
                  height={240}
                  width={240}
                  objectFit="contain"
                  objectPosition="center"
                />
              </Space>
            </Col>
            <Col span={14} sm={24}>
              <Space direction="vertical">
                {!sm && <BookStatus {...{ state, userId }} />}
                <CatalogsKeys {...{ catalogs }} />
                {name && <Text>{name}</Text>}
                {authors?.length > 0 && (
                  <Text type="secondary">
                    {arrToString(authors, ({ author }) => author?.name)}
                  </Text>
                )}
              </Space>
            </Col>
          </Row>
        </a>
      </Link>
    </Container>
  );
};

export default BookCard;
