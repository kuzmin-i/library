import React from "react";
import { Cover } from "./styles/styles";
import BookImage from "../../book/book-image";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

import { dummyRequest } from "./functions/handleThumbUpload";

const Thumb = ({ fileList, imageUrl, loadingThumb, setLoadingThumb }) => {
  return (
    <Cover
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      fileList={fileList}
      customRequest={dummyRequest}
      itemRender={(_, file = {}) => {
        const { url, uid } = file;

        return (
          <BookImage
            src={url}
            alt={uid}
            width="180"
            height="250"
            objectFit="contain"
            objectPosition="center"
          />
        );
      }}
      onChange={(info) => {
        if (info.file.status === "uploading") {
          setLoadingThumb(true);
          return;
        }
        if (info.file.status === "done") {
          console.log("info.file.originFileObj", info.file.originFileObj);
          /*getBase64(info.file.originFileObj, (_imageUrl) => {
                    setImageUrl(_imageUrl);
                    setLoadingThumb(false);
                  });*/
        }
      }}
    >
      {!imageUrl && !fileList && (
        <div>
          {loadingThumb ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </div>
      )}
    </Cover>
  );
};

export default Thumb;
