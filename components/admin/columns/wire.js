import React from "react";
import styled from "styled-components";
import { Skeleton } from "antd";

const WireBlock = styled.div`
  min-width: 100%;
  min-height: 100%;

  && * {
    max-width: 100%;
    width: 100%;
    min-width: 100%;
  }
`;

const wireColumns = [
  {
    title: "",
    width: "12.5%",
    dataIndex: "",
    key: "1",
    render: (e) => (
      <WireBlock>
        <Skeleton.Input
          style={{ maxWidth: "50px", height: "50px" }}
          active={true}
          size={"large"}
        ></Skeleton.Input>
      </WireBlock>
    ),
  },
  {
    title: "",
    width: "50%",
    dataIndex: "",
    key: "1",
    render: (e) => (
      <Skeleton active paragraph={{ rows: 2 }} title={false}></Skeleton>
    ),
  },
  {
    title: "",
    width: "12.5%",
    dataIndex: "",
    key: "1",
    render: (e) => <></>,
  },
  {
    title: "",
    width: "12.5%",
    dataIndex: "",
    key: "1",
    render: (e) => (
      <WireBlock>
        <Skeleton.Input
          style={{ minWidth: "60px" }}
          active={true}
          size={"large"}
        ></Skeleton.Input>
      </WireBlock>
    ),
  },
  {
    title: "",
    width: "12.5%",
    dataIndex: "",
    key: "1",
    render: (e) => (
      <WireBlock>
        <Skeleton.Input
          active={true}
          style={{ minWidth: "60px" }}
          size={"large"}
        ></Skeleton.Input>
      </WireBlock>
    ),
  },
];

export { wireColumns };
