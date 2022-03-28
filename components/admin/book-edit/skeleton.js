import React from "react";
import styled from "styled-components";
import { Skeleton } from "antd";

const SkeletContent = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  && > * + * {
    margin-left: 40px;
  }
`;

const WireThumb = styled(Skeleton.Input)`
  width: 180px;
  min-height: 220px;
`;

const WireContent = styled(Skeleton)`
  height: 400px;
`;

const SkeletonWrapper = ({ children, loading = true }) => {
  if (loading)
    return (
      <SkeletContent>
        <WireThumb active />
        <WireContent active paragraph={{ rows: 8 }} button={{active: true}} />
      </SkeletContent>
    );

  return children;
};

export default SkeletonWrapper;
