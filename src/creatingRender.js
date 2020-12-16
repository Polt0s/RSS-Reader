import i18next from 'i18next';

const urlInput = document.querySelector('.url-input');
const htmlErrors = document.querySelector('.error');

const renderChannels = (channel) => {
  const channelElement = document.querySelector('.feeds');
  channelElement.innerHTML = '';

  const headers = document.createElement('h2');
  headers.classList.add('headerChannel');
  headers.innerText = i18next.t('outputChannel');

  channel.forEach((feed) => {
    const ulFeed = document.createElement('ul');
    ulFeed.classList.add('list-group', 'mb-5');
    const items = document.createElement('li');
    items.classList.add('list-group-item');
    const title = document.createElement('h3');
    title.innerText = feed.mainTitle;
    const description = document.createElement('p');
    description.innerText = feed.mainDescription;
    items.append(title, description);
    ulFeed.append(items);
    channelElement.append(headers, ulFeed);
  });
};

const renderPosts = (posts) => {
  const postsContainers = document.querySelector('.posts');
  postsContainers.innerText = '';
  const postsHeader = document.createElement('h2');
  postsHeader.innerText = i18next.t('outputPosts');
  const ulPost = document.createElement('ul');
  ulPost.classList.add('list-group');

  posts.forEach((post) => {
    const elements = document.createElement('li');
    elements.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    const header = document.createElement('a');
    header.classList.add('active', 'font-weight-bold');
    header.setAttribute('target', '_blank');
    header.href = post.link;
    header.innerText = post.title;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'preview';
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#myModal');
    button.dataset.id = post.id;

    elements.append(header, button);
    ulPost.append(elements);

    header.addEventListener('click', () => {
      header.classList.remove('font-weight-bold');
      header.classList.add('font-weight-normal');
    });
    button.addEventListener('click', () => {
      header.classList.remove('font-weight-bold');
      header.classList.add('font-weight-normal');
    });
  });
  postsContainers.append(postsHeader, ulPost);
};

const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-body');
const modalHref = document.querySelector('.full-article');

const renderModal = (post) => {
  modalTitle.innerText = post.title;
  modalDescription.innerText = post.description;
  modalHref.href = post.link;
};

const renderError = (err) => {
  const errorType = err.join('');
  if (errorType === '') {
    urlInput.classList.remove('is-invalid');
    htmlErrors.classList.remove('text-danger');
    htmlErrors.textContent = i18next.t('errorsTrue');
    htmlErrors.style.color = 'green';
    return;
  }
  urlInput.classList.add('is-invalid');
  htmlErrors.classList.add('text-danger');
  htmlErrors.textContent = i18next.t('errors');
  htmlErrors.style.fontSize = '14pt';
};

export {
  renderChannels, renderPosts, renderError, renderModal,
};
