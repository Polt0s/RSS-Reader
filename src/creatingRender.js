import i18next from 'i18next';

const renderChannels = (channel) => {
  const feedback = document.querySelector('.feedback');
  feedback.innerHTML = '';
  const urlInput = document.querySelector('.url-input');
  urlInput.value = '';

  const headers = document.createElement('h4');
  headers.classList.add('headerChannel', 'borderChannel');
  headers.innerText = i18next.t('outputChannel');

  channel.forEach((feed) => {
    const row = document.createElement('div');
    row.classList.add('row');
    const feedsContainer = document.createElement('div');
    feedsContainer.classList.add('conteiner-channels', 'col-md-3', 'col-md-10');
    feedsContainer.append(headers);

    const title = document.createElement('h5');
    const titleDescription = document.createElement('p');
    title.classList.add('mt-2');
    title.innerText = feed.title;
    titleDescription.innerText = feed.description;
    feedsContainer.append(title, titleDescription);

    const postsContainer = document.createElement('div');
    postsContainer.classList.add('container-posts', 'col-md-10');
    postsContainer.setAttribute('id', feed.id);
    row.append(feedsContainer, postsContainer);

    feedback.classList.remove('invisible');
    feedback.prepend(row);
  });
};

const renderPosts = (posts) => {
  const postsContainers = document.querySelectorAll('.container-posts');
  // postsContainers.innerHTML = '';
  postsContainers.forEach((postsContainer) => {
    postsContainer.innerHTML = '';
  });

  posts.forEach((post) => {
    console.log(post);
    const conteiner = document.getElementById(post.feedId);
    const header = document.createElement('h4');
    const PostDescription = document.createElement('p');
    const link = document.createElement('a');

    header.innerText = post.title;
    header.classList.add('col-md-10');
    PostDescription.innerText = post.description;
    link.innerText = i18next.t('outputRead');
    link.classList.add('read-more');
    link.href = post.link;
    conteiner.append(header, PostDescription, link);
  });

  const postsContainer = document.querySelector('.container-posts');
  const postsHeader = document.createElement('h5');
  postsHeader.classList.add('posts-header', 'borderChannel');
  postsHeader.innerText = i18next.t('outputPosts');
  postsContainer.prepend(postsHeader);
};

export { renderChannels, renderPosts };
