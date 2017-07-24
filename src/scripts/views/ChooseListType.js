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
    <ViewContainer state={state} actions={actions} className="choose-list">
      <h2>Choose List Type</h2>

      <p>Learn Your Sight Words</p>

      <button onclick={() => {
        actions.updateList('all');
        actions.setCurrentNextAndPrevWord();
        actions.router.go(`/list/all`);
      }}>Start</button>
      
      <hr />

      <p>Practice Time!</p>

      <button className={(hasPracticeWords()) ? '' : 'disabled'} onclick={() => {
        actions.updateList('practice');
        actions.setCurrentNextAndPrevWord();
        actions.router.go(`/list/practice`);
      }}>Practice</button>

      <hr />

      <p>View all Sight Words</p>

      <button className="button button-outline">Words 1 - 100</button>
      <button className="button button-outline">Words 101 - 200</button>
      <button className="button button-outline">Words 201 - 300</button>
      <button className="button button-outline">Words 301 - 400</button>
      <button className="button button-outline">Words 401 - 500</button>
      <button className="button button-outline">Words 501 - 600</button>
      <button className="button button-outline">Words 601 - 700</button>
      <button className="button button-outline">Words 701 - 800</button>
      <button className="button button-outline">Words 801 - 900</button>
      <button className="button button-outline">Words 901 - 1000</button>
    </ViewContainer>
  );
};