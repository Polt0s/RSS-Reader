const rendering = (text) => {
  const root = document.querySelector('.jumbotron');
  const creatinDiv = document.createElement('div');
  creatinDiv.classList.add('new-container');
  root.append(creatinDiv);

  const commonChannel = document.createElement('div');
  commonChannel.classList.add('row-channel');
  root.append(commonChannel);

  const channelElements = document.createElement('div');
  channelElements.classList.add('col-md-10', 'col-lg-8');
  commonChannel.append(channelElements);

  const headerElement = document.createElement('h1');
  headerElement.classList.add('header');
  headerElement.textContent = text('headers');
  channelElements.append(headerElement);

  const listElements = document.createElement('div');
  listElements.classList.add('group-list');
  listElements.id = 'list-rss';
  channelElements.append(listElements);


}

const renderChanels = ([channel, activeChannels]) => {
  const currentChannel = document.getElementById(`${channel.id}`);
  if (currentChannel) {
    currentChannel.remove();
  }

  const channelList = document.getElementById('list-rss');
  const elementsList = document.createElement('a');
  elementsList.classList.add('group-list-item', 'group-list-item-active');
  elementsList.id = (`${channel.id}`);
  // elementsList.href = '#';

  const html = document.createElement('div');
  const div = document.createElement('div');
  div.setAttribute('class', 'd-sm-flex w-100 justify-content-between');
  div.id = channel.id;

  const paragraph = document.createElement('h1');
  paragraph.setAttribute('class', 'md-5');
  paragraph.id = channel.id;
  div.append(paragraph);
  const p = document.createElement('p');
  p.setAttribute('class', 'md-5');
  p.id = channel.id;
  html.append(div, p);

  if (channel.id === activeChannels) {
    elementsList.classList.add('active');
  }

  elementsList.innerHTML = html;
  channelList.append(elementsList);
}


const renderChangeElements = (id) => {
  const activeChannels = document.querySelector('.active');
  activeChannels.classList.remove('active');
  const newActiveChannels = document.getElementById(id);
  newActiveChannels.classList.add('active');
}

const isContent = {
  context: rendering,
  renderChanels: renderChanels,
  // allItems: ,
  renderChange: renderChangeElements,
};

export default (element, items) => isContent[element](items);
