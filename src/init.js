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

yup.setLocale({
  string: {
    url: () => ({ key: 'errors.url' }),
  },
  mixed: {
    required: () => ({ key: 'errors.required' }),
    notOneOf: () => ({ key: 'errors.exists' }),
  },
});

const validateUrl = (feeds) => {
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
    modal: document.querySelector('.modal'),
  };

  const watchedState = getWatchedState(state, elements);

  const loadNewRss = (url) => {
    watchedState.loadingState.status = 'loading';
    watchedState.loadingState.errors = [];
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
        watchedState.posts.push(...posts.map((post) => ({ ...post, feedId: url })));
        watchedState.loadingState.status = 'idle';
        watchedState.loadingState.errors = [];
        watchedState.form.currentURL = null;
      })
      .catch((err) => {
        if (err.isParsingError) {
          watchedState.loadingState.errors.push('errors.rss');
        } else if (err.isAxiosError) {
          watchedState.loadingState.errors.push('errors.network');
        }
        watchedState.loadingState.errors.push('errors.unknown');
        watchedState.loadingState.status = 'failed';
      });
  };

  const rssCheckUpdate = () => {
    const promises = watchedState.feeds.map((id) => axios.get(getProxyUrl(id.url))
      .then((responses) => {
        const rss = parseRSS(responses.data.contents);
        const { posts } = rss;
        return _.differenceWith(posts.link, state.posts);
      }));
    Promise.all(promises)
      .then((responses) => {
        const newPosts = responses.flat();
        watchedState.posts = [...state.posts, ...newPosts];
      })
      .finally(() => {
        setTimeout(() => rssCheckUpdate(), checkTimeout);
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.status = 'filling';
    watchedState.form.errors = [];
    const formData = new FormData(e.target);
    const currentUrl = formData.get('url');
    try {
      validateUrl(state.feeds).validateSync({
        url: currentUrl,
      });
      loadNewRss(currentUrl);
      setTimeout(() => rssCheckUpdate(), checkTimeout);
    } catch (err) {
      watchedState.form.errors.push(err.message.key);
      watchedState.form.status = 'invalid';
    }
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const postId = e.target.dataset.id;
    if (!postId) {
      return;
    }
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
