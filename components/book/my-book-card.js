import { Col, Grid, Row, Space, Typography } from "antd";
import Link from "next/link";
import styled from "styled-components";
import moment from "moment";

import { arrToString } from "@/lib/helpers";
import Key from "@/components/book/key";
import BookCardContainer from "@/components/book/book-card-container";
import { mediaSm } from "@/styles/theme/breakpoints";
import BookImage from "@/components/book/book-image";

const { useBreakpoint } = Grid;
const { Text } = Typography;

const Container = styled(BookCardContainer)`
  width: 100%;

  &&.ant-card {
    ${mediaSm} {
      padding: 0.75rem;
    }
  }

  .ant-space-align-top .ant-space-item:first-child {
    flex-shrink: 0;
  }
`;

const MyBookCard = ({ bookKey, authors, id, thumb, name, state }) => {
  const { sm = true } = useBreakpoint();
  const { exp } = { ...state };

  return (
    <Container bordered={false}>
      <Link href={`/book/${id}`}>
        <a>
          <Row gutter={[16, 8]}>
            <Col span={10}>
              <BookImage
                src={`${process.env.NEXT_PUBLIC_DOMAIN}/upload/thumb/${thumb}`}
                alt={name || ""}
                height={160}
                width={160}
                objectFit="contain"
                objectPosition="center"
              />
            </Col>
            <Col span={14}>
              <Space direction="vertical" size={sm ? 16 : 8}>
                {exp && <Text>{`Осталось ${moment().to(exp, true)}`}</Text>}
                {bookKey && <Key>{bookKey}</Key>}
                <Space direction="vertical">
                  {name && <Text>{name}</Text>}
                  {authors?.length > 0 && (
                    <Text type="secondary">
                      {arrToString(authors, ({ author }) => author?.name)}
                    </Text>
                  )}
                </Space>
              </Space>
            </Col>
          </Row>
        </a>
      </Link>
    </Container>
  );
};

export default MyBookCard;
