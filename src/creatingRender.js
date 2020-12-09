import i18next from 'i18next';

const renderChannels = (channel) => {
  const feedback = document.querySelector('.feedback');
  feedback.innerHTML = '';
  const urlInput = document.querySelector('.url-input');
  urlInput.value = '';

  const headers = document.createElement('h4');
  headers.classList.add('headerChannel');
  headers.innerText = i18next.t('outputChannel');

  channel.forEach((feed) => {
    // console.log(feed)
    const row = document.createElement('div');
    row.classList.add('row');
    const feedsContainer = document.createElement('div');
    feedsContainer.classList.add('conteiner-channels', 'col-md-3');
    feedsContainer.append(headers);

    const title = document.createElement('h5');
    const titleDescription = document.createElement('p');
    title.classList.add('mt-2');
    title.innerText = feed.mainTitle;
    titleDescription.innerText = feed.mainDescription;
    feedsContainer.append(title, titleDescription);

    const postsContainer = document.createElement('div');
    postsContainer.classList.add('container-posts', 'col-md-9');
    postsContainer.setAttribute('id', feed.id);
    row.append(feedsContainer, postsContainer);

    feedback.classList.remove('invisible');
    feedback.prepend(row);
  });
};

const renderPosts = (posts) => {
  const postsContainers = document.querySelectorAll('.container-posts');
  postsContainers.innerHTML = '';
  // postsContainers.forEach((postsContainer) => {
  // postsContainer.innerHTML = '';
  // });

  posts.forEach((post) => {
    // console.log(post);
    const conteiner = document.getElementById(post.feedId);
    const header = document.createElement('a');
    header.innerText = post.title;
    header.classList.add('mt-2', 'mb-0');
    header.href = post.link;
    header.style.fontSize = '16pt';
    const PostDescription = document.createElement('p');
    PostDescription.innerText = post.description;
    conteiner.append(header, PostDescription);
  });

  const postsContainer = document.querySelector('.container-posts');
  const postsHeader = document.createElement('h5');
  postsHeader.classList.add('posts-header');
  postsHeader.innerText = i18next.t('outputPosts');
  postsContainer.prepend(postsHeader);
};

export { renderChannels, renderPosts };
