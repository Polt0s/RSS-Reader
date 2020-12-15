import i18next from 'i18next';
// import jqery from ''
const feedback = document.querySelector('.feedback');
const urlInput = document.querySelector('.url-input');
const htmlErrors = document.querySelector('.error');

const renderChannels = (channel) => {
  feedback.innerHTML = '';
  urlInput.value = '';

  const headers = document.createElement('h4');
  headers.classList.add('headerChannel');
  headers.innerText = i18next.t('outputChannel');

  channel.forEach((feed) => {
    // console.log(feed)
    const row = document.createElement('div');
    row.classList.add('row');
    const feedsContainer = document.createElement('div');
    feedsContainer.classList.add('conteiner-channels', 'col-md-3', 'border-bottom', 'border-right', 'border-left');
    feedsContainer.append(headers);

    const title = document.createElement('h5');
    const titleDescription = document.createElement('p');
    title.classList.add('mt-2');
    title.innerText = feed.mainTitle;
    titleDescription.innerText = feed.mainDescription;
    feedsContainer.append(title, titleDescription);

    const postsContainer = document.createElement('div');
    postsContainer.classList.add('container-posts', 'col-md-9', 'border-bottom', 'border-right', 'border-left');
    postsContainer.setAttribute('id', feed.id);
    row.append(feedsContainer, postsContainer);

    feedback.classList.remove('invisible');
    feedback.prepend(row);
  });
};

const renderPosts = (posts) => {
  const postsContainers = document.querySelectorAll('.container-posts');
  postsContainers.innerHTML = '';

  posts.forEach((post) => {
    // console.log(post);

    const conteiner = document.getElementById(post.feedId);
    const rootContainer = document.createElement('div');
    rootContainer.classList.add('d-flex', 'justify-content-between', 'border-bottom', 'border-top');
    const header = document.createElement('a');
    header.innerText = post.title;
    header.classList.add('probaActive', 'font-weight-bold', 'mt-2', 'mb-0');
    header.setAttribute('target', '_blank');
    header.href = post.link;

    header.addEventListener('click', () => {
      header.classList.remove('font-weight-bold');
      header.classList.add('font-weight-normal');
    });

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'preview';
    button.classList.add('btn-click', 'btn-primary', 'btn', 'px-sm', 'border-right');
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#myModal');
    button.dataset.id = post.id;
    // <button data-id='123'>

    // button.addEventListener('click', openButton.bind(null, modal));
    // button.addEventListener('click', () => {
    //   header.classList.remove('font-weight-bold');
    //   header.classList.add('font-weight-normal');
    // });
    // const closeButton = document.querySelector('[data-dismiss="modal"]');
    // closeButton.addEventListener('click', closeHandler.bind(null, modal));
    // const closeButton2 = document.getElementById('close');
    // closeButton2.addEventListener('click', closeHandler.bind(null, modal));

    rootContainer.append(header, button);
    conteiner.append(rootContainer);
  });

  const postsContainer = document.querySelector('.container-posts');
  const postsHeader = document.createElement('h5');
  postsHeader.classList.add('posts-header');
  postsHeader.innerText = i18next.t('outputPosts');
  postsContainer.prepend(postsHeader);
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
