const parseRSS = (data) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(data, 'text/xml');

  const parseError = document.querySelector('parsererror');
  if (parseError) {
    const error = new Error(parseError.innerHTML);
    error.isParsingError = true;
    throw error;
  }

  const mainTitle = document.querySelector('channel > title').innerHTML;
  const mainDescription = document.querySelector('channel > description').innerHTML;

  const elements = document.querySelectorAll('channel > item');
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
