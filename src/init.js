import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import 'bootstrap';
import parseRSS from './rss.js';
import resources from './locales/index.js';
import getWatchedState from './watchers';

const responseTimeout = 10000;
const checkTimeout = 5000;

const getProxyUrl = (url) => {
  const urlWithProxy = new URL('/get', 'https://hexlet-allorigins.herokuapp.com');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const getValidationUrl = (feeds) => {
  const feedsId = feeds.map((e) => e.url);
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
    },
    loadingState: {
      status: 'idle',
      error: '',
    },
  };

  const elements = {
    output: document.querySelector('.output'),
    form: document.querySelector('form'),
    input: document.querySelector('.url-input'),
    button: document.querySelector('[type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
  };

  const watchedState = getWatchedState(state, elements);

  const loadNewRss = (url) => {
    watchedState.loadingState.status = 'loading';
    watchedState.loadingState.error = '';
    axios.get(getProxyUrl(url), { timeout: responseTimeout })
      .then((response) => {
        const rss = parseRSS(response.data.contents);
        const { title, description, posts } = rss;
        watchedState.feeds.push({
          title,
          description,
          url,
          id: url,
        });
        watchedState.posts.unshift(...posts.map((post) => ({
          ...post,
          feedId: url,
          id: _.uniqueId(),
        })));
        watchedState.loadingState.status = 'idle';
        watchedState.loadingState.error = '';
      })
      .catch((err) => {
        if (err.isParsingError) {
          watchedState.loadingState.error = 'errors.rss';
          watchedState.loadingState.status = 'failed';
        } else if (err.isAxiosError) {
          watchedState.loadingState.error = 'errors.network';
          watchedState.loadingState.status = 'failed';
        }
        watchedState.loadingState.error = 'errors.unknown';
        watchedState.loadingState.status = 'failed';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.status = 'filling';
    watchedState.form.errors = [];
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    try {
      getValidationUrl(state.feeds).validateSync({
        url: currentUrl,
      });
      yup.setLocale({
        string: {
          url: () => ({ key: 'errors.url' }),
        },
        mixed: {
          required: () => ({ key: 'errors.required' }),
          notOneOf: () => ({ key: 'errors.exists' }),
        },
      });
      loadNewRss(currentUrl);
    } catch (err) {
      watchedState.form.errors.push(err.message.key);
      watchedState.form.status = 'invalid';
    }
  });

  const rssCheckUpdate = () => {
    if (watchedState.feeds.length === 0) {
      setTimeout(() => rssCheckUpdate(), checkTimeout);
      return;
    }
    const promises = watchedState.feeds.map((feed) => axios.get(getProxyUrl(feed.url))
      .then((response) => {
        const rss = parseRSS(response.data.contents);
        const { posts } = rss;
        return _.difference(posts.link, state.posts.link);
      }));
    Promise.all(promises)
      .then((response) => {
        const newPosts = response.flat();
        watchedState.posts.unshift(...newPosts);
      })
      .finally(() => {
        setTimeout(() => rssCheckUpdate(), checkTimeout);
      });
  };

  elements.postsContainer.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (!postId) {
      return;
    }
    watchedState.modal = { id: postId };
    watchedState.readPosts.add(postId);
  });
  setTimeout(() => rssCheckUpdate(), checkTimeout);
};

const app = () => i18next.init({
  lng: 'en',
  resources,
}).then(() => {
  startApp();
});

export default app;
