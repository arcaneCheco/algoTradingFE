export const assembleQueryString = (queryParams?: { [key: string]: any }) => {
  if (!queryParams) return "";

  let isFirst = true;
  return Object.entries(queryParams).reduce((acc, [key, value]) => {
    let delimiter = "";
    if (isFirst) {
      isFirst = false;
    } else {
      delimiter = "&";
    }
    return acc + delimiter + `${key}=${value}`;
  }, "?");
};
