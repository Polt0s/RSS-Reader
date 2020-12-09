import onChange from 'on-change';
// import _ from 'lodash';
import i18next from 'i18next';
import { renderChannels, renderPosts } from './creatingRender.js';

const feedback = document.querySelector('.feedback');
const submitButton = document.querySelector('[type="submit"]');
const urlInput = document.querySelector('.url-input');

const renderError = (err) => {
  const { errors } = err;
  // const typeError = errors.join('');

  if (errors === '') {
    urlInput.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
    return;
  }
  urlInput.classList.add('is-invalid');
  feedback.classList.add('text-danger');
  feedback.textContent = i18next.t('errors');
};

const renderLoadingState = (loadingState) => {
  switch (loadingState) {
    case 'failed':
      submitButton.disabled = false;
      break;
    case 'filling':
      urlInput.classList.remove('is-invalid');
      submitButton.disabled = false;
      submitButton.innerText = 'add';
      break;
    case 'sending':
      submitButton.disabled = true;
      submitButton.innerText = i18next.t('button');
      break;
    case 'finished':
      submitButton.disabled = false;
      submitButton.innerText = i18next.t('button');
      feedback.classList.add('text');
      feedback.innerText = i18next.t('added');
      break;
    default:
      throw new Error(`Unknown state: ${loadingState}`);
  }
};

const getWatchedState = (state) => {
  const watchedState = onChange(state, (path) => {
    // console.log(state, path)
    switch (path) {
      case 'form':
        renderLoadingState(state.form);
        break;
      case 'channels':
        renderChannels(state.channels);
        break;
      case 'posts':
        renderPosts(state.posts);
        break;
      case 'errors':
        renderError(state.errors);
        break;
      default:
        break;
    }
  });
  return watchedState;
};

export default getWatchedState;
