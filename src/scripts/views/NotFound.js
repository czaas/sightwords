import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const NotFound = (state, actions) => (
  <ViewContainer>
    <h1>404</h1>
    <p>Not what you're looking for!</p>

    <p><a onclick={() => actions.go('/')}>Start over</a></p>
  </ViewContainer>
);