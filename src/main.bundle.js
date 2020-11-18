import * as yup from 'yup';
import onChange from 'onChange';
import axios from 'axios';
import _ from 'lodash';

const schema = yup.object().shape({
  name: yup.string().required(),
});

// const erroMessages = {
//   network: {
//     error: 'Network Problems. Try again.',
//   },
// };

const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return _.keyBy(e.inner, 'path');
  }
};

const updateValidationState = (watcherState) => {
  const errors = validate(watcherState.form.fields);
  watcherState.form.valid = _.isEqual(errors, {});
  watcherState.form.errors = errors;
};


const app = () => {
  const state = {
    form: {
      processState: 'filling',
      processErrors: null,
    },
    fields: {
      name: '',
    },
    valid: true,
    errors: {},
  }

  const conteiner = document.querySelector('[data-container="sign-up"]');
  console.log(conteiner);


};

export default app;

