import { notification } from "antd";

/* error оповещение */
const openErrorNotification = (error, type = "books") => {
  if (error) console.log(error.message);

  let explanation;
  switch (type) {
    case "books":
      explanation = "Книга не была добавлена в таблицу";
      break;
    case "authors":
      explanation = "Автор не был добавлен в таблицу";
      break;
    case "publications":
      explanation = "Издательство не было добавлено  в таблицу";
      break;
  }

  notification.error({
    message: `Ошибка!`,
    description: explanation,
    placement: "bottomRight",
  });
};

/* success оповещение */
const openSuccessNotification = (data, type = "books") => {
  let explanation;
  switch (type) {
    case "books":
      explanation = "Книга успешно добавлена / изменена";
      break;
    case "authors":
      explanation = "Автор успешно добавлен / изменен";
      break;
    case "publications":
      explanation = "Издательство успешно добавлено / изменено";
      break;
  }

  notification.success({
    message: `Успешно!`,
    description: explanation,
    placement: "bottomRight",
  });
};

/* вытаскиваем id для тегов */
const getIdFromObject = (els, type) => {
  if (els) {
    switch (type) {
      case "authors":
        return els.map(({ author }) => {
          return author.id;
        });
      case "publishers":
        return els.map(({ publisher }) => {
          return publisher.id;
        });
      case "catalogs":
        return els.map(({ catalog }) => {
          return catalog.id;
        });
    }
  }

  return [];
};

export { openErrorNotification, openSuccessNotification, getIdFromObject };
