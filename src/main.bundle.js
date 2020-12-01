import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as y from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watched from './watcherView.js';
import parsers from './parsers.js';
import i18next from 'i18next';

const schema = (url, item) => {
  yup.string()
    .url()
    .validateSync(url)
    .required()
    .notOneOf(item)
};

const sites = 'https://ru.hexlet.io/lessons.rss';

const getNewRSS = (state, url) => {
  state.form.processState = 'sending';
  const newUrl = `${sites}${state.form.value}`;
  axios.get(newUrl)
    .then((response) => {
      const data = parsers(response.data);
      state.form.processState = 'finished';
      state.feed.activeChanels = _.uniqueId();
      const { title, post, sort } = data;
      state.feed.channels.push({
        title,
        post,
        url,
        id: updateActive,
      });
      sort.forEach((el) => {
        const updatePost = { ...el, id: _.uniqueId() };
        state.feed.post.push(updatePost);
      });
      state.form.value = '';
    })
    .catch((err) => {
      if (err.request) {
        form.errors = ['network'];
      }
      form.processState = 'filling';
    });
};

// const checkRssData = (state) => {
//   const promises = state.channels.map((channel) => {
//     return axios.get(`${sites}${url}`)
//       .then(({ data }) => {
//         const feedData = parser(data)
//         const beforePost = feedData.feed.post.map((item) => ({ ...item, idChannel: channel.id }));
//         const afterPost = state.feed.post.filter((post) => post.idChannel === post.id);
//         const output = _.difference(beforePost, afterPost, (a, b) => a.title === b.title,);
//         state.feed.post.unshift(output);
//       })
//   })
//   Promise.all(promises).finally(() => {
//     setTimeout(() => checkRssData(state), 5000);
//   });
// };

const rssCheckUpdate = (state) => {
  const promiseUrl = state.feed.channels.map(({ url }) => axios.get(`${sites}${url}`));
  const update = ({ data }) => {
    const feedData = parsers(data);
    const updatePost = feedData.post.map(({ link }) => link);
    const updateChannel = state.feed.channels.find((channel) => channel.title = channel);
    const updatePostList = state.feed.post.filter(({ channelId }) => channelId === updateChannel.id);
    const updateLink = updatePostList.map(({ link }) => link);

    const output = _.difference(updatePost, updateLink);
    return [...updatePostList, ...output];
  };
  Promise.all(promiseUrl)
    .then(update).finally(() => {
      setTimeout(() => rssCheckUpdate(state), 5000);
    });
};

const app = () => {
  const state = {
    feed: {
      channels: [],
      post: [],
      activeChanels: '',
    },
    form: {
      processState: 'filling',
      value: '',
      valid: true,
      errors: [],
    }
  };

  rssCheckUpdate(state);
  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const getUrl = formData.get('url');
    getNewRSS(state, getUrl);
  });

  const input = document.querySelector('[name="url"]');
  input.addEventListener('input', (e) => {
    state.form.value = e.target.value;
    const list = state.feed.channels.map(({ url }) => url);
    try {
      schema(state.form.value, list);
      state.form.valid = true;
      form.errors = [];
    } catch (err) {
      state.form.valid = false;
      state.form.errors = [err.type];
    }
  });
};

export default app;

