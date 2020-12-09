const parsers = (data) => {
  const parser = new DOMParser();
  const strParse = parser.parseFromString(data, 'text/xml');
  // console.log(strParse);
  const mainTitle = strParse.querySelector('title').textContent;
  const mainDescription = strParse.querySelector('description').textContent;

  const elements = strParse.querySelectorAll('item');
  const posts = [...elements].map((postItem) => {
    const title = postItem.querySelector('title').textContent;
    const description = postItem.querySelector('description') ? postItem.querySelector('description').textContent
      : '';
    const link = postItem.querySelector('link').textContent;
    const post = {
      title, description, link,
    };
    return post;
  });

  const feed = {
    mainTitle,
    mainDescription,
    posts,
  };
  return feed;
};

export default parsers;
