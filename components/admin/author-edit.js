import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Steps } from "antd";
import SkeletonWrapper from "./book-edit/skeleton";

import { useLazyQuery } from "@apollo/client";
import { GET_AUTHOR } from "@/lib/apollo/admin_queries";

import MainSettings from "./author-edit/settings-main";
import TagsSettings from "./author-edit/settings-tags";
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

import { handleAuthorData } from "./book-edit/functions/handleAuthorData";

const { Step } = Steps;

const AuthorEdit = ({
  set,
  visible = false,
  setSelectedBookID: setSelectedAuthorID,
  selectedBookID: selectedAuthorID = null,
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
    if (!selectedAuthorID) {
      const id = uuidv4();

      setMainData(({ id: oldId, ...otherProps }) => ({ id, ...otherProps }));
    }
  }, [selectedAuthorID]);

  /* end handle Tags */

  const [fileList, setFileList] = useState(null);

  const [getAuthor, { data, loading, error }] = useLazyQuery(GET_AUTHOR, {});

  /* получить данные книги */
  useEffect(() => {
    if (selectedAuthorID) {
      getAuthor({ variables: { id: selectedAuthorID } });
    }
  }, [selectedAuthorID]);

  useEffect(() => {
    if (readyButton === "error") {
      openErrorNotification(null, "authors");
    }
  }, [readyButton]);

  useEffect(() => {
    if (data) {
      handleAuthorData({ data, setMainData, setTagsData });
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
          setSelectedAuthorID(null);
        }}
      />

      <Wrapper>
        <Content>
          <SkeletonWrapper loading={loading}>
            {/* обложка */}
            <Thumb {...{ fileList, imageUrl, loadingThumb, setLoadingThumb }} />

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

export default AuthorEdit;
