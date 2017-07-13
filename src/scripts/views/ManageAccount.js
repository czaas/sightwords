import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';


export const ManageAccount = (state, actions, children) => {
  function saveName(e) {
    if (e) { e.preventDefault(); }
    let name = document.getElementById('name');

    actions.saveName({ name: name.value });
  }


  return (
    <ViewContainer state={state} actions={actions}>
      <h2>Manage your account</h2>

      
      <form onsubmit={saveName}>
        <label>
          Hello,&nbsp;
          <input type="text" id="name" value={state.currentUser.name || ''} />
        </label>
        <p><button>Save</button></p>
      </form>

      <form>
        <p><a onclick={() => actions.resetList({ listType: 'main' })}>Reset Main List</a></p>
        <p><a onclick={() => actions.resetList({ listType: 'practice' })}>Reset Practice List</a></p>
      </form>
    </ViewContainer>
  );
};