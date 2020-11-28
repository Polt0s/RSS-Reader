import * as y from 'yup';
import axios from 'axios';
import watched from './watcherView.js';
import parser from './parsers.js';
import rendering from './creatingRender.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import _, { after } from 'lodash';


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
      const data = parser(response.data);
      state.form.processState = 'finished';
      const updateActive = state.feed.activeChanels = _.activeChanels();
      const { title, post, sort } = data;
      state.feed.channels.push({
        title,
        post,
        url,
        id: updateActive,
      });
      sort.forEach((el) => {
        state.feed.post.push({ ...el, updateActive })
      });
      state.form.value = '';
    })
    .catch((err) => {
      state.form.errors = [err.type];
      form.processState = 'filling';
    });
};

const checkRssData = (state) => {
  const promises = state.channels.map((channel) => {
    return axios.get(`${sites}${url}`)
      .then(({ data }) => {
        const feedData = parser(data)
        const beforePost = feedData.feed.post.map((item) => ({ ...item, idChannel: channel.id }));
        const afterPost = state.feed.post.filter((post) => idChannel.id === post.id);
        const output = _.differenceWith(beforePost, afterPost, (a, b) => a.title === b.title,);
        state.feed.post.unshift(output);
      })
  })
  Promise.all(promises).finally(() => {
    setTimeout(() => checkRssData(state), 2000);
  });
};



const app = () => {
  const State = {
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
}

export default app;

