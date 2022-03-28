import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* gql */
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADD_BOOK } from "@/lib/apollo/admin_queries";
import { BOOK_QUERY } from "@/lib/apollo/queries";
/* */

/* шаги */
import MainSettings from "./book-edit/settings-main";
import DetailsSettings from "./book-edit/settings-details";
import TagsSettings from "./book-edit/settings-tags";
import SettingsSkeleton from "./book-edit/settings-skeleton";
/* */

import { Steps } from "antd";
import SkeletonWrapper from "./book-edit/skeleton";

/* функции */
import {
  openErrorNotification,
  openSuccessNotification,
} from "./book-edit/functions/functions";
import { adminConfigs } from "./book-edit/functions/admin-configs";

import {
  Backdrop,
  Wrapper,
  Content,
  CustomForm,
  CustomSteps,
} from "./book-edit/styles/styles";
import Thumb from "./book-edit/thumb";

import { handleFileList } from "./book-edit/functions/handleThumbUpload";
import { handleBookData } from "./book-edit/functions/handleBookData";
import { handleBookForm } from "./book-edit/functions/handleBookForm";

const { Step } = Steps;

const BookEdit = ({
  set,
  visible = false,
  setSelectedBookID,
  selectedBookID = null /* определяет режим создания или редактирования */,
}) => {
  if (!visible) return true;

  const testMode = true;

  /* табы: Шаг1 , Шаг2, Шаг3 */
  const [currentStep, setCurrentStep] = useState(0); /* 0, 1, 2 */

  /* handle form data */
  const [thumbData, setThumbData] = useState(null);
  const [mainData, setMainData] = useState({}); /* шаг 1 */
  const [settingsData, setSettingsData] = useState({}); /* шаг 2*/
  const [tagsData, setTagsData] = useState({});
  /* */

  useEffect(() => {
    if (!selectedBookID) {
      const id = uuidv4();

      setMainData(({ id: oldId, ...otherProps }) => ({ id, ...otherProps }));
    }
  }, [selectedBookID]);

  /* handle cover */
  const [loadingThumb, setLoadingThumb] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const [fileList, setFileList] = useState(null);
  /* */

  const [getBook, { data, loading, error }] = useLazyQuery(BOOK_QUERY, {});
  const [readyButton, setReadyButton] = useState(
    null
  ); /* null | 'loading' | 'success' */

  /* получить данные книги */
  useEffect(() => {
    if (selectedBookID) {
      getBook({ variables: { id: selectedBookID } });
    }
  }, [selectedBookID]);

  useEffect(() => {
    if (data) {
      /* раскинуть мета данные по шагам 1, 2, 3 */
      handleBookData({
        data,
        setMainData,
        setSettingsData,
        setTagsData,
        setThumbData,
      });
      /* */
    }
  }, [data]);

  /* обложка для ниги */
  useEffect(() => {
    if (thumbData) {
      handleFileList({ thumbData, setFileList });
    }
  }, [thumbData]);

  /* запрос на создание */
  const [addBook] = useMutation(ADD_BOOK, {
    ...adminConfigs,
    onCompleted: () => {
      openSuccessNotification(null, "books");
      set(false);
      return;
    },
    onError: (e) => openErrorNotification(e, "books"),
  });

  useEffect(() => {
    if (readyButton === "error") {
      openErrorNotification(null, "books");
    }
  }, [readyButton]);

  /* отправка данных в handleBookForm */
  const handleForm = () => {
    handleBookForm({
      mainData,
      settingsData,
      tagsData,
      /* */
      testMode,
      /* */
      addBook,
      setReadyButton,
    });
  };

  return (
    <>
      <Backdrop
        onClick={() => {
          set(false);
          setSelectedBookID(null);
        }}
      />

      <Wrapper>
        <Content>
          <SkeletonWrapper loading={loading}>
            {/* обложка */}

            <Thumb {...{ fileList, imageUrl, loadingThumb, setLoadingThumb }} />

            {!loading && (
              <CustomForm name="bookEdit" layout="vertical">
                <CustomSteps current={currentStep} size={"small"}>
                  <Step title="Основное" />
                  <Step title="Характеристики" />
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
                      <DetailsSettings
                        {...{ setCurrentStep, setSettingsData }}
                        {...settingsData}
                      />
                    )}

                    {currentStep === 2 && (
                      <TagsSettings
                        {...{ setCurrentStep, setTagsData }}
                        {...{ handleForm }}
                        {...tagsData}
                        {...{ readyButton, setReadyButton }}
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

export default BookEdit;
