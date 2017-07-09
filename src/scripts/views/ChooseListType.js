import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const ChooseListType = (state, actions, data, emit) => {
  function hasPracticeWords() {
    let hasPracticeWords = false;

    if (state.currentUser.list) {
      for (let i = 0; i < state.currentUser.list.length; i++) {
        if (state.currentUser.list[i].practice === true) {
          hasPracticeWords = true;
        }

        if (hasPracticeWords === true) {
          i = state.currentUser.list.length;
        }
      }
    }

    return hasPracticeWords;
  }

  let disableIfNoPracticeWords = (hasPracticeWords()) ? '' : 'disabled';

  return (
    <ViewContainer state={state} actions={actions}>
      <h2>Choose List Type</h2>

      <p><a onclick={() => actions.updateGameType('default')}>All words List</a></p>
      <p>or</p>
      <p><a className={disableIfNoPracticeWords} onclick={() => actions.updateGameType('practice')}>Your practice List</a></p>
    </ViewContainer>
  );
};