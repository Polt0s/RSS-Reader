import onChange from 'on-change';
import render from './creatingRender.js';

const watched = (state, item) => {
  const feedback = document.querySelector('.feedback');
  const submitButton = document.querySelector('[type="submit"]');
  const processStateHandler = (processState) => {
    switch (processState) {
      case 'failed':
        submitButton.disabled = false;
        break;
      case 'filling':
        submitButton.disabled = false;
        submitButton.textContent = 'add';
        break;
      case 'sending':
        submitButton.disabled = true;
        submitButton.textContent = 'Loading';
        break;
      case 'finished':
        submitButton.disabled = false;
        submitButton.textContent = 'add';
        feedback.classList.add('text');
        feedback.textContent = 'added chanels';
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    };
  };

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        processStateHandler(value);
        break;
      case 'form.valid':
        submitButton.disabled = !state.form.valid;
      case 'form.value':
        const fields = document.querySelector('[name="url"]');
        fields.value = form.value;
      case 'feed.channels':
        channels.forEach((el) => {
          render('renderChange', [el, activeChanels]);
        });

        const listChannels = document.getElementById('list-rss');
        listChannels.addEvenListener('click', (e) => {
          state.feed.activeChanels = e.target.id;
          render('renderChange', e.target.id);
        });
      case 'feed.activeChanels':
        const rss = document.getElementById('list-rss');
        rss.innerHTML = '';
      //
      case 'form.errors':
        const typeError = form.errors.join('');
        if (typeError === '' || state.form.value === '') {
          fields.classList.remove('is-invalid');
          feedback.textContent = '';
          break;
        }
        fields.classList.add('is-invalid');
        feedback.textContent = `form.errors.${typeError}`;
    }
  });
}

export default watched;
