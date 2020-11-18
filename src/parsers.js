const RSS_URL = 'https://ru.hexlet.io/lessons.rss';

fetch(RSS_URL)
  .then(responce => responce.text())
  .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))