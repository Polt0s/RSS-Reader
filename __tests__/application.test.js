// @ts-check

import '@testing-library/jest-dom';

import fs from 'fs';
import path from 'path';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import nock from 'nock';

import init from '../src/init.js';

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFixture = (filename) => {
  const fixturePath = getFixturePath(filename);

  const rss = fs.readFileSync(fixturePath, 'utf-8');
  return rss;
};
const rss1 = readFixture('rss1.xml');
const rssUrl = 'https://ru.hexlet.io/lessons.rss';
const corsProxy = 'https://hexlet-allorigins.herokuapp.com';
const corsProxyApi = '/get';

const htmlPath = getFixturePath('document.html');
const html = fs.readFileSync(htmlPath, 'utf-8');
const htmlUrl = 'https://ru.hexlet.io';

const index = path.join(__dirname, '..', 'index.html');
const initHtml = fs.readFileSync(index, 'utf-8');

const elements = {};

beforeAll(() => {
  nock.disableNetConnect();
});

afterAll(() => {
  nock.cleanAll();
  nock.enableNetConnect();
});

beforeEach(async () => {
  document.body.innerHTML = initHtml;

  await init();

  elements.input = screen.getByRole('textbox', { name: 'url' });
  elements.submit = screen.getByRole('button', { name: 'add' });
});

test('adding', async () => {
  const scope = nock(corsProxy)
    .get(corsProxyApi)
    .query({ url: rssUrl, disableCache: 'true' })
    .reply(200, { contents: rss1 });

  userEvent.type(elements.input, rssUrl);
  userEvent.click(elements.submit);

  expect(await screen.findByText(/Rss has been loaded/i)).toBeInTheDocument();
  scope.done();
});

test('validation (unique)', async () => {
  nock(corsProxy)
    .get(corsProxyApi)
    .query({ url: rssUrl, disableCache: 'true' })
    .reply(200, { contents: rss1 });

  userEvent.type(elements.input, rssUrl);
  userEvent.click(elements.submit);

  expect(await screen.findByText(/Rss has been loaded/i)).toBeInTheDocument();

  userEvent.type(elements.input, rssUrl);
  userEvent.click(elements.submit);

  expect(await screen.findByText(/Rss already exists/i)).toBeInTheDocument();
});

test('validation (valid url)', () => {
  userEvent.type(elements.input, 'wrong');
  userEvent.click(elements.submit);
  expect(screen.getByText(/Must be valid url/i)).toBeInTheDocument();
});

test('handling non-rss url', async () => {
  nock(corsProxy)
    .get(corsProxyApi)
    .query({ url: htmlUrl, disableCache: 'true' })
    .reply(200, { contents: html });

  userEvent.type(elements.input, htmlUrl);
  userEvent.click(elements.submit);

  expect(await screen.findByText(/This source doesn't contain valid rss/i)).toBeInTheDocument();
});

test('handling network error', async () => {
  const error = { message: 'no internet', isAxiosError: true };
  nock(corsProxy)
    .get(corsProxyApi)
    .query({ url: rssUrl, disableCache: 'true' })
    .replyWithError(error);

  userEvent.type(elements.input, rssUrl);
  userEvent.click(elements.submit);

  expect(await screen.findByText(/Network error/i)).toBeInTheDocument();
});

describe('handle disabling ui elements during loading', () => {
  test('handle successful loading', async () => {
    nock(corsProxy)
      .get(corsProxyApi)
      .query({ url: rssUrl, disableCache: 'true' })
      .reply(200, { contents: rss1 });

    expect(elements.input).not.toHaveAttribute('readonly');
    expect(elements.submit).toBeEnabled();

    userEvent.type(elements.input, rssUrl);
    userEvent.click(elements.submit);

    expect(elements.input).toHaveAttribute('readonly');
    expect(elements.submit).toBeDisabled();

    await waitFor(() => {
      expect(elements.input).not.toHaveAttribute('readonly');
    });
    expect(elements.submit).toBeEnabled();
  });
});

describe('load feeds', () => {
  test('render feed and posts', async () => {
    nock(corsProxy)
      .get(corsProxyApi)
      .query({ url: rssUrl, disableCache: 'true' })
      .reply(200, { contents: rss1 });

    userEvent.type(elements.input, rssUrl);
    userEvent.click(elements.submit);

    expect(await screen.findByText(/Новые уроки на Хекслете/i)).toBeInTheDocument();
    expect(await screen.findByText(/Практические уроки по программированию/i)).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Агрегация \/ Python: Деревья/i })).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /Traversal \/ Python: Деревья/i })).toBeInTheDocument();
  });
});

test('modal', async () => {
  nock(corsProxy)
    .get(corsProxyApi)
    .query({ url: rssUrl, disableCache: 'true' })
    .reply(200, { contents: rss1 });

  userEvent.type(elements.input, rssUrl);
  userEvent.click(elements.submit);

  const previewBtns = await screen.findAllByRole('button', { name: /preview/i });
  expect(screen.getByRole('link', { name: /Агрегация \/ Python: Деревья/i })).toHaveClass('font-weight-bold');
  userEvent.click(previewBtns[0]);
  expect(await screen.findByText('Цель: Научиться извлекать из дерева необходимые данные')).toBeVisible();
  expect(screen.getByRole('link', { name: /Агрегация \/ Python: Деревья/i })).not.toHaveClass('font-weight-bold');
});
