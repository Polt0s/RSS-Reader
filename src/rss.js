const parseRSS = (data) => {
  const parser = new DOMParser();
  const strParse = parser.parseFromString(data, 'text/xml');

  const parseError = strParse.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.innerHTML);
    error.isParsingError = true;
    throw error;
  }

  const mainTitle = strParse.querySelector('channel > title').innerHTML;
  const mainDescription = strParse.querySelector('channel > description').innerHTML;

  const elements = strParse.querySelectorAll('channel > item');
  const items = [...elements].map((postItem) => {
    const title = postItem.querySelector('title').innerHTML;
    const description = postItem.querySelector('description').innerHTML;
    const link = postItem.querySelector('link').innerHTML;
    const id = postItem.querySelector('guid').innerHTML;
    return {
      title, description, link, id,
    };
  });
  return {
    title: mainTitle,
    description: mainDescription,
    posts: items,
  };
};

export default parseRSS;
