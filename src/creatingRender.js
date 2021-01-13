/* eslint-disable no-param-reassign */
import i18next from 'i18next';

const renderChannel = (state, elements) => {
  elements.channel.innerHTML = '';
  const headers = document.createElement('h2');
  headers.textContent = i18next.t('Channel');
  elements.channel.append(headers);

  state.channel.forEach((feed) => {
    const ulFeed = document.createElement('ul');
    ulFeed.classList.add('list-group', 'mb-5');
    const items = document.createElement('li');
    items.classList.add('list-group-item');
    const title = document.createElement('h3');
    title.innerText = feed.title;
    const description = document.createElement('p');
    description.innerText = feed.description;
    items.append(title, description);
    ulFeed.append(items);
    elements.channel.append(ulFeed);
  });
};

const renderPosts = (state, elements) => {
  elements.posts.innerText = '';
  const postsHeader = document.createElement('h2');
  postsHeader.innerText = i18next.t('Posts');
  const ulPost = document.createElement('ul');
  ulPost.classList.add('list-group');

  state.posts.forEach((post) => {
    const items = document.createElement('li');
    items.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
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

    items.append(header, button);
    ulPost.append(items);

    header.addEventListener('click', () => {
      header.classList.remove('font-weight-bold');
      header.classList.add('font-weight-normal');
    });
    button.addEventListener('click', () => {
      header.classList.remove('font-weight-bold');
      header.classList.add('font-weight-normal');
    });
  });
  elements.posts.append(postsHeader, ulPost);
};

const modalTitle = document.querySelector('.modal-title');
const modalDescription = document.querySelector('.modal-body');
const modalHref = document.querySelector('.full-article');

const renderModal = (posts) => {
  modalTitle.innerText = posts.title;
  modalDescription.innerText = posts.description;
  modalHref.href = posts.link;
};

const elementReadonly = (input, value) => {
  if (value === true) {
    input.setAttribute('readonly', 'readonly');
  }
  input.removeAttribute('readonly');
};

const renderForm = (form, elements) => {
  const errors = [...form.errors];
  if (errors.length > 0) {
    elementReadonly(elements.input, false);
    elements.output.classList.add('text-danger');
    elements.output.textContent = i18next.t('errorsRss');
    if (errors.includes('notOneOf')) {
      elementReadonly(elements.input, true);
      elements.output.classList.add('text-danger');
      elements.output.textContent = i18next.t('errors');
    } else {
      elementReadonly(elements.input, false);
      elements.output.classList.remove('text-success');
      elements.output.textContent = i18next.t('errorsUrl');
    }
  } else if (errors.length === 0) {
    elementReadonly(elements.input, true);
    elements.output.classList.add('text-success');
    elements.output.classList.remove('text-danger');
    elements.output.textContent = i18next.t('loading');
  }
  elements.input.value = form.currentURL;

  if (errors.includes('url')) {
    elements.input.classList.add('is-invalid');
  } else {
    elements.input.classList.remove('is-invalid');
  }
  elements.button.disabled = true;
};

export {
  renderChannel, renderPosts, renderForm, renderModal,
};
