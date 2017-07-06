'use strict';

if (module.hot) {
  module.hot.accept();
}

import '../styles/index.scss';

import { 
  app,
  h,
} from 'hyperapp';
import { Router } from 'hyperapp-router';

const Nav = ({ state, actions }) => {
  function linkClicked (e) {
    e.preventDefault();
    let path = this.attributes.path.value;

    if (path) {
      actions.router.go(path);
    }
  };

  return (
    <nav>
      <a onclick={linkClicked} path="/">Home</a> <a onclick={linkClicked} path="/about">About</a> <a onclick={linkClicked} path="/contact">Contact</a>
    </nav>
  );
};

const Home = (state, actions) => {
  return (
    <main>
      <Nav state={state} actions={actions} />
      <h1>Home</h1>
    </main>
  );
};

const About = (state, actions) => (
  <main>
    <Nav state={state} actions={actions} />
    <h1>About</h1>
  </main>
);

const Contact = (state, actions) => (
  <main>
    <Nav state={state} actions={actions} />
    <h1>Contact</h1>
  </main>
);

app({
  root: document.getElementById('mount'),

  state: {

  },

  actions: {

  },
  
  mixins: [Router],

  view: [
    ['/', Home],
    ['/about', About],
    ['/contact', Contact],
  ],
});