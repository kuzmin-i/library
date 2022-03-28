const prodURL = "https://library.strelka-kb.com";

function getBase64(img, callback) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(img);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("success");
  }, 0);
};

const handleFileList = ({ thumbData = {}, setFileList }) => {
  const { thumb } = thumbData;

  if (thumb) {
    setFileList([
      {
        name: "cover",
        uid: "212211",
        status: "done",
        url: `${prodURL}/upload/thumb/${thumb}`,
      },
    ]);
  }
};

export { getBase64, dummyRequest, handleFileList };
