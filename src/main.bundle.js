// import _ from 'lodash';
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
        const { mainTitle, mainDescription, posts } = rss;
        watchedState.channels.push({
          mainTitle,
          mainDescription,
          url,
          id: url,
        });
        watchedState.posts.push(...posts.map((post) => ({ ...post, feedId: url })));
        watchedState.form.value = '';
      })
      .catch((err) => {
        watchedState.loadingState = 'filling';
        if (err.request) {
          watchedState.form.errors = ['network'];
        }
      });
  };

  // const rssCheckUpdate = () => {
  //   // const { channels, post } = state.feed;
  //   const promiseUrl = watchedState.channels.map(({ url }) => axios.get(getProxyUrl(url)));
  //   const update = ({ data }) => {
  //     const feedData = parsers(data);
  //     const updatePost = feedData.post.map(({ link }) => link);
  //     const ChannelUp = watchedState.channels.find((channel) => channel.title === channel);
  //     const updateList = watchedState.post.filter(({ channelId }) => channelId === ChannelUp.id);
  //     const updateLink = updateList.map(({ link }) => link);

  //     const output = _.difference(updatePost, updateLink);
  //     return [...updateList, ...output];
  //   };
  //   Promise.all(promiseUrl)
  //     .then((response) => {
  //       response.forEach(update);
  //     }).finally(() => setTimeout(() => rssCheckUpdate(state), 5000));
  // };
  // rssCheckUpdate();

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    // console.log('url', url);
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
