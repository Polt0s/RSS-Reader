import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parseRSS from './rss.js';
import resources from './locales/index.js';
import getWatchedState from './watchers';

const getProxyUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

yup.setLocale({
  string: {
    url: () => ({ key: 'errorsUrl' }),
  },
  mixed: {
    required: () => ({ key: 'required' }),
    notOneOf: () => ({ key: 'errorsExists' }),
  },
});

const validator = (feeds) => {
  const feedsId = feeds.map((e) => e.id);
  const schema = yup.object().shape({
    url: yup.string().url().notOneOf(feedsId).required(),
  });
  return schema;
};

const startApp = () => {
  const state = {
    feeds: [],
    posts: [],
    modal: { id: null },
    readPosts: new Set(),
    form: {
      status: 'filling',
      errors: [],
      currentURL: '',
    },
    loadingState: {
      status: 'idle',
      errors: [],
    },
  };

  const elements = {
    output: document.querySelector('.output'),
    form: document.querySelector('form'),
    input: document.querySelector('.url-input'),
    button: document.querySelector('[type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
  };

  const watchedState = getWatchedState(state, elements);

  const getNewRss = (url) => {
    watchedState.loadingState.status = 'loading';
    watchedState.loadingState.errors = [];
    axios.get(getProxyUrl(url, { timeout: 10000 }))
      .then((response) => {
        const rss = parseRSS(response.data.contents);
        const { title, description, posts } = rss;
        watchedState.feeds.push({
          title,
          description,
          url,
          id: url,
        });
        watchedState.posts.push(...posts.map((post) => ({ ...post, feedId: url })));
        watchedState.loadingState.status = 'idle';
        watchedState.loadingState.errors = [];
        watchedState.form.currentURL = null;
      })
      .catch((err) => {
        if (err.isParsingError) {
          watchedState.loadingState.errors.push('errorsRss');
        } else if (err.isAxiosError) {
          watchedState.loadingState.errors.push('network');
        }
        watchedState.loadingState.errors.push('unknown');
        watchedState.loadingState.status = 'failed';
      });
  };

  const rssCheckUpdate = () => {
    const promise = watchedState.feeds.map((id) => axios.get(getProxyUrl(id.url))
      .then((response) => {
        const rss = parseRSS(response.data.contents);
        const { posts } = rss;
        return _.differenceWith(posts.link, state.posts);
      }));
    Promise.all(promise)
      .then((response) => {
        const newPosts = response.flat();
        watchedState.posts = [...state.posts, ...newPosts];
      });
    setTimeout(() => rssCheckUpdate(), 5000);
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.status = 'filling';
    watchedState.form.errors = [];
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    try {
      validator(state.feeds).validateSync({
        url: currentUrl,
      });
      getNewRss(currentUrl);
      setTimeout(() => rssCheckUpdate(), 5000);
    } catch (err) {
      watchedState.form.errors.push(err.message.key);
      watchedState.form.status = 'invalid';
    }
  });

  const openingModal = document.querySelector('.posts');
  openingModal.addEventListener('click', (e) => {
    if (!e.target.dataset.id) {
      return;
    }
    const postId = e.target.dataset.id;
    watchedState.modal = { id: postId };
    watchedState.readPosts.add(postId);
  });
};

const app = () => i18next.init({
  lng: 'en',
  resources,
}).then(() => {
  startApp();
});

export default app;
