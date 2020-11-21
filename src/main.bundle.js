import * as y from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';


class State {
  constructor() {
    this.state = {
      feed: {
        chanels: [],
        post: [],
        activeChanels: '',
      },
      form: {
        processState: 'filling',
        value: '',
        valid: true,
        errors: [],
      },
    };
  }
};
// const res = new State();
// console.log(res.state.feed.chanels)
const app = () => {

}

export default app;

