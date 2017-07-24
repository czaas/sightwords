import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';


export const ManageAccount = (state, actions, children) => {
  function saveName(e) {
    if (e) { e.preventDefault(); }
    let name = document.getElementById('name');

    actions.saveName({ name: name.value });
    actions.displayNotification({
      message: 'Your name has been updated.',
      type: 'success',
    });
  }

  function confirmDeleteUser(e) {
    if (e) { e.preventDefault(); }
    var confirmation = window.prompt('type in your name to delete') === state.currentUser.name;

    if (confirmation) {
      actions.deleteUser();
      actions.displayNotification({
        message: 'Account deleted.',
        type: 'success',
        timeout: 2000,
      });
      actions.router.go('/');
    } else {
      actions.displayNotification({
        message: 'You entered your name inccorectly.',
        type: 'error',
        timeout: 2000,
      });
    }
  }

  return (
    <ViewContainer state={state} actions={actions} className="manage-account">
      <h2>Manage your account</h2>

      <form onsubmit={saveName}>
        <label>
          Hello,&nbsp;
          <input type="text" id="name" required value={state.currentUser.name || ''} />
        </label>
        <p><button>Save</button></p>
      </form>

      <hr />

      <p><a onclick={() => {
        actions.resetList({ listType: 'main' });
        actions.displayNotification({
          'message': 'Main list reset',
          'type': 'success',
        });
      }}
      className="button button-outline"
      >Reset Main List</a></p>
      <p><a onclick={() => {
        actions.resetList({ listType: 'practice' });
        actions.displayNotification({
          'message': 'Practice list reset',
          'type': 'success',
        });
      }}
      className="button button-outline"
      >Reset Practice List</a></p>

      <p><a className="button button-outline" onclick={confirmDeleteUser}>Delete Account</a></p>
    </ViewContainer>
  );
};