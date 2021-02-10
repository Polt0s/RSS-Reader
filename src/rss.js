const parseRSS = (data) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(data, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.textContent);
    error.isParsingError = true;
    throw error;
  }

  const mainTitle = dom.querySelector('channel > title').textContent;
  const mainDescription = dom.querySelector('channel > description').textContent;

  const elements = dom.querySelectorAll('channel > item');
  const items = [...elements].map((postItem) => {
    const title = postItem.querySelector('title').textContent;
    const description = postItem.querySelector('description').textContent;
    const link = postItem.querySelector('link').textContent;
    return {
      title, description, link,
    };
  });
  return {
    title: mainTitle,
    description: mainDescription,
    posts: items,
  };
};

export default parseRSS;
