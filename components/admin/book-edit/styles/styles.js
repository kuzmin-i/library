import styled from "styled-components";
import { Upload, Steps } from "antd";

const Backdrop = styled.div`
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;

  left: 0;
  top: 0;

  z-index: 101;
`;

const Wrapper = styled.div`
  position: fixed;
  background: white;

  display: flex;
  justify-content: center;

  width: 100%;
  max-width: calc(1200px);

  height: 100%;
  max-height: calc(600px);

  left: 50%;
  top: 50%;

  transform: translateX(-50%) translateY(-50%);

  z-index: 102;

  padding: 64px 48px;
`;

const Content = styled.div`
  display: flex;
  max-width: 700px;
  width: 100%;

  && > * + * {
    margin-left: 48px;
  }
`;

const CustomForm = styled.div`
  width: 100%;

  && .ant-form-item {
    flex-direction: column;
  }

  && .ant-form-item-label {
    text-align: left;
  }

  && .ant-form-item-label label {
    font-weight: 400;
  }

  && input,
  && textarea,
  &&&& .ant-input-number,
  && .ant-select-selector {
    border-color: black;
    width: 100%;
  }

  && input:not(.ant-select-selection-search-input):focus,
  &&&& .ant-input-number:focus,
  && textarea:focus {
    border-color: #5d5fef;
    box-shadow: 0 0 0 4px rgb(93 95 239 / 20%);
  }

  && .ant-form-item-explain * {
    font-size: 12px;
  }
`;

const Cover = styled(Upload)`
  min-width: 180px;
  max-width: 180px;
  height: 250px;

  & .ant-upload-list {
    height: 100%;
  }

  & .ant-upload-select-picture-card {
    width: 100%;
    height: 100%;
  }

  & .ant-upload-list-picture-card-container {
    width: 100%;
    height: 100%;
  }
`;

const prodURL = "https://library.strelka-kb.com";

const CustomSteps = styled(Steps)`
  margin-bottom: 24px;
  cursor: pointer;
`;

const TagInput = styled.div`
  height: 32px;
  padding: 4px 11px;
  border: 1px solid rgb(217, 217, 217);
`;

export {
  Backdrop,
  Wrapper,
  Content,
  CustomForm,
  Cover,
  prodURL,
  CustomSteps,
  TagInput,
};
