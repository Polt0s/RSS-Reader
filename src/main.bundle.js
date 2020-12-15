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

  // const rssCheckUpdate = (state) => {
  //   const { channels, posts } = state;
  //   const promiseUrl = channels.map(({ url }) => axios.get(getProxyUrl(url)));
  //   const update = ({ data }) => {
  //     const feedData = parsers(data.contents);
  //     const { mainTitle, allPosts } = feedData;
  //     const allPostsink = allPosts.map(({ link }) => link);

  //     const ChannelUp = channels.map((channel) => channel.mainTitle === mainTitle);
  //     // console.log(ChannelUp);
  //     const updateList = posts.filter(({ feedId }) => feedId === ChannelUp.id);
  //     const updateLink = updateList.map(({ link }) => link);

  //     const output = _.difference(allPostsink, updateLink);
  //     return [...updateList, ...output];
  //   };
  //   Promise.all(promiseUrl)
  //     .then((response) => {
  //       response.forEach(update);
  //     }).finally(() => setTimeout(() => rssCheckUpdate(state), 5000));
  // };

  // rssCheckUpdate(state);

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
