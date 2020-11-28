const parser = (data) => {
  const parser = DOMParser();
  const strParse = parser.parseFromString(data, 'text/xml');
  const title = strParse.querySelector('title');
  const descrioption = strParse.querySelector('description');
  const elements = strParse.querySelector('element');
  const sort = [...elements].forEach((el) => {
    const line = el.querySelector('line');
    const linkPost = el.querySelector('post');
    return { text: line.innerHTML, link: linkPost.innerHTML };
  })
  const output = {
    title: title.innerHTML,
    post: descrioption.innerHTML,
    sort,
  }
  return output;
};

export default parser;