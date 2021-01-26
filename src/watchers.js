import onChange from 'on-change';
import {
  renderForm, renderFeeds, renderPosts, renderModal, renderloadingState,
} from './creatingRender.js';

const getWatchedState = (state, elements) => {
  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'feeds':
        renderFeeds(state, elements);
        break;
      case 'readPosts':
      case 'posts':
        renderPosts(state, elements);
        break;
      case 'form.status':
        renderForm(state, elements);
        break;
      case 'loadingState.status':
        renderloadingState(state, elements);
        break;
      case 'modal':
        renderModal(state.posts.find(({ id }) => id === state.modal.id), elements);
        break;
      default:
        break;
    }
  });
  return watchedState;
};

export default getWatchedState;
