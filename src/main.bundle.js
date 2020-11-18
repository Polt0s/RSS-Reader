import * as yup from 'yup';
import onChange from 'on-change';
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

const renderErrors = (elements, errors) => {
  Object.entries(elements).forEach(([name, element]) => {
    const errorElement = element.nextElementSibling;
    const error = errors[name];
    if (errorElement) {
      element.classList.remove('errorElement');
      element.remove();
    }
    if (!error) {
      return;
    }
    const feedbackElement = document.createElement('div');
    feedbackElement.classList.add('invalid-feedback');
    feedbackElement.innerHTML = error.message;
    element.classList.add('is-invalid');
    element.after(feedbackElement);
  });
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

