import onChange from 'on-change';
import i18next from 'i18next';
import { renderChannels, renderPosts, renderError } from './creatingRender.js';

const submitButton = document.querySelector('[type="submit"]');
const urlInput = document.querySelector('.url-input');

const renderForm = (valid, loadingState) => {
  switch (loadingState) {
    case 'filling':
      urlInput.classList.remove('is-invalid');
      submitButton.disabled = false;
      submitButton.innerText = 'add';
      if (!valid) {
        urlInput.disabled = true;
        urlInput.classList.add('is-invalid');
      }
      break;
    case 'sending':
      submitButton.disabled = true;
      submitButton.innerText = i18next.t('button');
      break;
    case 'finished':
      submitButton.disabled = false;
      submitButton.innerText = i18next.t('button');
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
        renderForm(state.form.valid, state.form.loadingState);
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
