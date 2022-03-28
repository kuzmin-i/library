import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Steps } from "antd";
import SkeletonWrapper from "./book-edit/skeleton";

import { useLazyQuery } from "@apollo/client";
import { GET_PUBLISHER } from "@/lib/apollo/admin_queries";

import MainSettings from "./publication-edit/settings-main";
import TagsSettings from "./publication-edit/settings-tags";
import SettingsSkeleton from "./book-edit/settings-skeleton";

import { openErrorNotification } from "./book-edit/functions/functions";

import {
  Backdrop,
  Wrapper,
  Content,
  CustomForm,
  CustomSteps,
} from "./book-edit/styles/styles";
import Thumb from "./book-edit/thumb";

import { handlePublicationData } from "./book-edit/functions/handlePublicationData";

const { Step } = Steps;

const PublicationEdit = ({
  set,
  visible = false,
  setSelectedBookID: setSelectedPublicationID,
  selectedBookID: selectedPublicationID = null,
}) => {
  if (!visible) return true;

  /* handle cover */
  const [loadingThumb, setLoadingThumb] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  /* */

  /* handle data */
  //const [thumbData, setThumbData] = useState(null);
  const [mainData, setMainData] = useState({}); /* шаг 1 */
  const [tagsData, setTagsData] = useState({});
  /* */

  const [readyButton, setReadyButton] = useState(
    null
  ); /* null | 'loading' | 'success' */

  useEffect(() => {
    if (!selectedPublicationID) {
      const id = uuidv4();

      setMainData(({ id: oldId, ...otherProps }) => ({ id, ...otherProps }));
    }
  }, [selectedPublicationID]);

  /* end handle Tags */

  const [fileList, setFileList] = useState(null);

  const [getPublisher, { data, loading, error }] = useLazyQuery(
    GET_PUBLISHER,
    {}
  );

  /* получить данные книги */
  useEffect(() => {
    if (selectedPublicationID) {
      getPublisher({ variables: { id: selectedPublicationID } });
    }
  }, [selectedPublicationID]);

  useEffect(() => {
    if (readyButton === "error") {
      openErrorNotification(null, "publications");
    }
  }, [readyButton]);

  useEffect(() => {
    if (data) {
      handlePublicationData({ data, setMainData, setTagsData });
    }
  }, [data]);

  const handleForm = () => {
    setReadyButton("loading");
    const changeBtnStatus = setTimeout(() => {
      setReadyButton("error");
    }, 1500);
  };

  return (
    <>
      <Backdrop
        onClick={() => {
          set(false);
          setSelectedPublicationID(null);
        }}
      />

      <Wrapper>
        <Content>
          <SkeletonWrapper loading={loading}>

            {!loading && (
              <CustomForm layout="vertical">
                <CustomSteps
                  current={currentStep}
                  size={"small"}
                  style={{ maxWidth: "230px" }}
                >
                  <Step title="Основное" />
                  <Step title="Теги" />
                </CustomSteps>

                <SettingsSkeleton currentStep={currentStep}>
                  <>
                    {currentStep === 0 && (
                      <MainSettings
                        {...{ setCurrentStep, setMainData }}
                        {...mainData}
                      />
                    )}

                    {currentStep === 1 && (
                      <TagsSettings
                        {...{
                          setCurrentStep,
                          setTagsData,
                          readyButton,
                          handleForm,
                        }}
                        {...tagsData}
                      />
                    )}
                  </>
                </SettingsSkeleton>
              </CustomForm>
            )}
          </SkeletonWrapper>
        </Content>
      </Wrapper>
    </>
  );
};

export default PublicationEdit;
