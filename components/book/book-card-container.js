import styled from "styled-components";
import { Card } from "antd";

const BookCardContainer = styled(Card)`
  padding-bottom: 2rem;

  .ant {
    &-card {
      &-body {
        padding: 0;
      }

      &-meta-title {
        font-weight: 700;
        white-space: normal;
      }
    }

    &-space {
      max-width: 100%;
    }

    &-typography {
      font-size: 1rem;
      line-height: 1.25;
    }
  }
`;

export default BookCardContainer;
