const parsers = (data) => {
  const parser = DOMParser();
  const strParse = parser.parseFromString(data, 'text/xml');
  const title = strParse.querySelector('title');
  const descrioption = strParse.querySelector('description');
  const elements = strParse.querySelector('element');
  const sort = [...elements].forEach((el) => {
    return { text: el.querySelector('line').innerHTML, link: el.querySelector('post').innerHTML };
  });
  const output = {
    title: title.innerHTML,
    post: descrioption.innerHTML,
    sort,
  };
  return output;
};

export default parsers;
