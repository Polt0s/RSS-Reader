/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parseRSS from './rss.js';
import resources from './locales/index.js';
import getWatchedState from './watchers';

const getProxyUrl = (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

yup.setLocale({
  string: {
    url: () => ({ key: 'errorsUrl' }),
  },
  mixed: {
    required: () => ({ key: 'network' }),
    notOneOf: () => ({ key: 'errors' }),
  },
});

const validator = (channel) => {
  const channelsId = channel.map((e) => e.id);
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(channelsId).required(),
  });
  return schema;
};

const startApp = () => {
  const state = {
    channel: [],
    posts: [],
    modal: { id: null },
    form: {
      status: 'filling',
      errors: [],
      currentURL: '',
    },
    loadingState: {
      status: 'loading',
      errors: [],
    },
  };

  const elements = {
    output: document.querySelector('.output'),
    form: document.querySelector('form'),
    input: document.querySelector('.url-input'),
    button: document.querySelector('.btn-primary'),
    channel: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
  };

  const watchedState = getWatchedState(state, elements);

  const getNewRss = (url) => {
    watchedState.loadingState.status = 'loading';
    watchedState.loadingState.errors = [];
    axios.get(getProxyUrl(url))
      .then((response) => {
        const rss = parseRSS(response.data.contents);
        const { title, description, posts } = rss;
        watchedState.channel.push({
          title,
          description,
          url,
          id: url,
        });
        watchedState.posts.push(...posts.map((post) => ({ ...post, feedId: url })));
        watchedState.form.currentURL = null;
      })
      .catch((err) => {
        watchedState.loadingState.errors.push(err);
      });
  };

  const rssCheckUpdate = (watchedState) => {
    const promise = watchedState.channel.map((id) => axios.get(getProxyUrl(id.url))
      .then((response) => {
        const rss = parseRSS(response.data.contents);
        const { posts } = rss;
        return _.differenceWith(posts.link, state.posts);
      }));
    Promise.all(promise)
      .then((response) => {
        const newPosts = response.flat();
        watchedState.posts = [...state.posts, ...newPosts];
        setTimeout(() => rssCheckUpdate(watchedState), 5000);
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.errors = [];
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    try {
      validator(state.channel).validateSync({
        url: currentUrl,
      });
      getNewRss(state.form.currentURL);
    } catch (err) {
      watchedState.form.errors.push(err.type);
    }
  });

  elements.input.addEventListener('input', (e) => {
    state.form.currentURL = e.target.value;
  });

  const openingModal = document.querySelector('.posts');
  openingModal.addEventListener('click', (e) => {
    if (!e.target.dataset.id) {
      return;
    }
    const postId = e.target.dataset.id;
    watchedState.modal = { id: postId };
  });
  rssCheckUpdate(watchedState);
};

const app = () => {
  i18next.init({
    lng: 'en',
    resources,
  }).then(() => {
    startApp();
  });
};

export default app;
