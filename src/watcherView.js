import onChange from 'on-change';
// import _ from 'lodash';
import i18next from 'i18next';
import { renderChannels, renderPosts } from './creatingRender.js';

// const feedback = document.querySelector('.feedback');
const submitButton = document.querySelector('[type="submit"]');
const urlInput = document.querySelector('.url-input');
const htmlErrors = document.querySelector('.error');

const renderError = (err) => {
  // const { errors } = state;
  const errorType = err.join('');
  if (errorType === '') {
    urlInput.classList.remove('is-invalid');
    htmlErrors.classList.remove('text-danger');
    htmlErrors.textContent = '';
    return;
  }
  urlInput.classList.add('is-invalid');
  htmlErrors.classList.add('text-danger');
  htmlErrors.textContent = i18next.t('errors');
};

const renderForm = (valid, loadingState) => {
  switch (loadingState) {
    case 'filling':
      urlInput.classList.remove('is-invalid');
      submitButton.disabled = false;
      submitButton.innerText = 'add';
      // htmlErrors.innerText = '';
      if (!valid) {
        urlInput.disabled = true;
        urlInput.classList.add('is-invalid');
        // htmlErrors.innerText = 'error';
      }
      break;
    case 'sending':
      submitButton.disabled = true;
      submitButton.innerText = i18next.t('button');
      // submitButton.append(spinner);
      break;
    case 'finished':
      submitButton.disabled = false;
      submitButton.innerText = i18next.t('button');
      // feedback.classList.add('text');
      // htmlErrors.innerText = i18next.t(`added.${errors}`);
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
