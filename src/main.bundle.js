import _ from 'lodash';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';

import getWatchedState from './watcherView.js';
import resources from './locales/index.js';
import parsers from './parsers.js';

const schema = (url, item) => {
  yup.string()
    .url()
    .validateSync(url)
    .required()
    .notOneOf(item);
};

const startApp = () => {
  const state = {
    channels: [],
    posts: [],
    modal: { id: null },
    form: {
      loadingState: 'filling',
      value: '',
      valid: true,
    },
    errors: [],
  };
  const watchedState = getWatchedState(state);

  const getProxyUrl = (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;

  const getNewRSS = (url) => {
    watchedState.loadingState = 'sending';
    axios.get(getProxyUrl(url))
      .then((response) => {
        const rss = parsers(response.data.contents);
        // console.log(rss)
        const { mainTitle, mainDescription, allPosts } = rss;
        watchedState.channels.push({
          mainTitle,
          mainDescription,
          url,
          id: url,
        });
        watchedState.posts.push(...allPosts.map((post) => ({ ...post, feedId: url })));
        watchedState.form.value = '';
      })
      .catch((err) => {
        watchedState.loadingState = 'filling';
        if (err.request) {
          watchedState.form.errors = ['network'];
        }
      });
  };

  // eslint-disable-next-line no-shadow
  const rssCheckUpdate = (state) => {
    const { channels, posts } = state;
    channels.forEach((feed) => {
      axios.get(getProxyUrl(feed.url))
        .then((response) => {
          const newRss = parsers(response.data.contents);
          const { title, allPosts } = newRss;
          const updateLink = allPosts.map(({ link }) => link);
          const currentChannel = channels.find((channel) => channel.title === title);
          const currentPosts = posts.filter(({ feedId }) => feedId === currentChannel.id);
          const currentLink = currentPosts.map(({ link }) => link);
          const postsDifferenceList = _.difference(updateLink, currentLink);
          return [...currentPosts, ...postsDifferenceList];
        });
    });
    setTimeout(() => rssCheckUpdate(state), 5000);
  };

  rssCheckUpdate(state);

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    getNewRSS(url);
  });

  const input = document.querySelector('[name="url"]');
  input.addEventListener('input', (e) => {
    watchedState.form.loadingState = 'filling';
    watchedState.form.value = e.target.value;
    const list = watchedState.channels.map(({ url }) => url);
    try {
      schema(watchedState.form.value, list);
      watchedState.form.valid = true;
      watchedState.errors = [];
    } catch (err) {
      watchedState.form.valid = false;
      watchedState.errors = [err.type];
    }
  });

  const clickPost = document.querySelector('.feedback');
  clickPost.addEventListener('click', (e) => {
    if (!e.target.dataset.id) {
      return;
    }
    const postId = e.target.dataset.id;
    watchedState.modal = { id: postId };
  });
};

const app = () => {
  i18next.init({
    lng: 'en',
    debug: true,
    resources,
  }).then(() => {
    startApp();
  });
};

export default app;
