const parseRSS = (data) => {
  const parser = new DOMParser();
  const strParse = parser.parseFromString(data, 'text/xml');
  const mainTitle = strParse.querySelector('channel > title').textContent;
  const mainDescription = strParse.querySelector('channel > description').textContent;

  const elements = strParse.querySelectorAll('channel > item');
  const allPosts = [...elements].map((postItem) => {
    const title = postItem.querySelector('title').textContent;
    const description = postItem.querySelector('description') ? postItem.querySelector('description').textContent
      : '';
    const link = postItem.querySelector('link').textContent;
    const id = postItem.querySelector('guid').textContent;
    return {
      title, description, link, id,
    };
  });
  return {
    title: mainTitle,
    description: mainDescription,
    posts: allPosts,
  };
};

export default parseRSS;
