import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const ChooseListType = (state, actions, data, emit) => {
  var mainListCount = state.currentUser.list.filter((word) => word.complete).length;
  var practiceListCount = state.currentUser.list.filter((word) => word.practice).length;

  return (
    <ViewContainer state={state} actions={actions} className="choose-list">
      <h2>Choose List Type</h2>

      <p>Learn Your Sight Words</p>

      <blockquote>
        <p><em>You have completed</em> {mainListCount} of {state.currentUser.list.length} words.</p>
      </blockquote>

      <button onclick={() => {
        actions.updateList('all');
        actions.setCurrentNextAndPrevWord();
        actions.router.go(`/list/all`);
      }}>Start</button>
      
      <hr />

      <p>Practice Time!</p>

      <blockquote>
        <p><em>You have {practiceListCount} word{practiceListCount === 1 ? '' : 's'} on your practice list.</em></p>
      </blockquote>
      <button className={(practiceListCount >= 1) ? '' : 'disabled'} onclick={() => {
        actions.updateList('practice');
        actions.setCurrentNextAndPrevWord();
        actions.router.go(`/list/practice`);
      }}>Practice</button>

      <hr />

      <p>View all Sight Words</p>

      <button onclick={() => actions.router.go('/list/group/1-100')} className="button button-outline">Words 1 - 100</button>
      <button onclick={() => actions.router.go('/list/group/101-200')} className="button button-outline">Words 101 - 200</button>
      <button onclick={() => actions.router.go('/list/group/201-300')} className="button button-outline">Words 201 - 300</button>
      <button onclick={() => actions.router.go('/list/group/301-400')} className="button button-outline">Words 301 - 400</button>
      <button onclick={() => actions.router.go('/list/group/401-500')} className="button button-outline">Words 401 - 500</button>
      <button onclick={() => actions.router.go('/list/group/501-600')} className="button button-outline">Words 501 - 600</button>
      <button onclick={() => actions.router.go('/list/group/601-700')} className="button button-outline">Words 601 - 700</button>
      <button onclick={() => actions.router.go('/list/group/701-800')} className="button button-outline">Words 701 - 800</button>
      <button onclick={() => actions.router.go('/list/group/801-900')} className="button button-outline">Words 801 - 900</button>
      <button onclick={() => actions.router.go('/list/group/901-1000')} className="button button-outline">Words 901 - 1000</button>
    </ViewContainer>
  );
};