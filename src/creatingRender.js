/* eslint-disable no-param-reassign */
import i18next from 'i18next';

const renderChannel = (state, elements) => {
  elements.channel.innerHTML = '';
  const header = document.createElement('h2');
  header.textContent = i18next.t('channel');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');

  state.channel.forEach((feed) => {
    const list = document.createElement('li');
    list.classList.add('list-group-item');
    const title = document.createElement('h3');
    title.textContent = feed.title;
    const description = document.createElement('p');
    description.textContent = feed.description;
    list.appendChild(title);
    list.appendChild(description);
    ul.appendChild(list);
  });
  elements.channel.appendChild(header);
  elements.channel.appendChild(ul);
};

const renderPosts = (state, elements) => {
  const { posts, readPosts } = state;
  const header = document.createElement('h2');
  header.innerText = i18next.t('Posts');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');

  posts.forEach((post) => {
    const list = document.createElement('li');
    list.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
    const link = document.createElement('a');
    const style = readPosts.has(post.id) ? 'font-weight-normal' : 'font-weight-bold';
    link.classList.add(`${style}`);
    link.textContent = post.title;
    link.setAttribute('href', post.link);
    link.setAttribute('target', '_blank');
    link.dataset.id = post.id;
    link.setAttribute('rel', 'noopener noreferrer');

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-primary', 'btn-sm');
    button.textContent = i18next.t('preview');
    button.type = 'button';
    button.dataset.id = post.id;
    button.dataset.toggle = 'modal';
    button.dataset.target = '#modal';
    list.append(link);
    list.append(button);
    ul.append(list);
  });
  elements.posts.innerHTML = '';
  elements.posts.append(header);
  elements.posts.append(ul);
};

const renderModal = (posts, elements) => {
  const { modalTitle, modalDescription, modalLink } = elements;
  modalTitle.textContent = posts.title;
  modalDescription.textContent = posts.description;
  modalLink.setAttribute('href', posts.link);
};

const renderloadingState = (loadingState, elements) => {
  const { input, output, button } = elements;
  switch (loadingState.status) {
    case 'loading':
      input.readOnly = true;
      button.disabled = true;
      output.classList.add('text-success');
      output.classList.remove('text-danger');
      output.textContent = '';
      break;
    case 'failed':
      input.readOnly = false;
      button.disabled = false;
      output.classList.add('text-danger');
      output.textContent = i18next.t(loadingState.errors);
      break;
    case 'idle':
      input.value = '';
      input.readOnly = false;
      button.disabled = false;
      output.classList.add('text-success');
      output.textContent = i18next.t('loading');
      break;
    default:
      output.classList.add('text-danger');
      throw new Error(`Unknown status: '${loadingState.status}'`);
  }
};

const renderForm = (form, elements) => {
  const { output, input } = elements;
  if (form.status === 'invalid') {
    input.classList.add('is-invalid');
    output.classList.remove('text-success');
    output.textContent = i18next.t(form.errors);
    output.classList.add('text-danger');
  } else {
    input.classList.remove('is-invalid');
  }
};

export {
  renderChannel, renderPosts, renderForm, renderModal, renderloadingState,
};
