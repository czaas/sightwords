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

  var mainListCount = 0;
  var practiceListCount = 0;

  if (state.currentUser.list) {
    for (var i = 0; i < state.currentUser.list.length; i++) {
      if (state.currentUser.list[i].complete) {
        mainListCount++;
      }

      if (state.currentUser.list[i].practice) {
        practiceListCount++;
      }
    }
  }

  return (
    <ViewContainer state={state} actions={actions}>
      <h2>Choose List Type</h2>

      <p><a onclick={() => {
        actions.router.go(`/list/all/${ state.currentWord.id }`);
        actions.setNextCurrentWord('all');
      }}>All words List <span>{mainListCount} / {(state.currentUser.list) ? state.currentUser.list.length : undefined}</span></a></p>
      <p>or</p>
      <p><a className={disableIfNoPracticeWords} onclick={() => {
        actions.router.go('/list/practice');
        actions.setNextCurrentWord('practice');
      }}>Your practice List <span>{practiceListCount}</span></a></p>
    </ViewContainer>
  );
};