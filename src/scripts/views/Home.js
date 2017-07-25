import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const Home = (state, actions, data, emit) => {

  let showSelectUser = state.allUsers.length >= 1 ? '' : 'hide';

  function createNewUser(e) {
    if (e) { e.preventDefault(); }

    let newNameElement = document.getElementById('new-user-name');

    let newName = newNameElement.value.trim('');
    
    if (newName !== '') {
      actions.createNewUser(newName);

      newNameElement.value = '';
    } else {
      actions.displayNotification({ 
        message: 'Please enter a name',
        type: 'warning',
      });
    }
  }

  return (
    <ViewContainer state={state} actions={actions} className='home'>
      <h1>Sight Words</h1>

      <p>Sight Words app for memorizing common words to be able to read on sight one word at a time. Practice and save your childrens progress as your they learn their sight words.</p>

      <div className="row">
        <div className="column">
          <p>Learn and practice <strong>1000 sight words</strong>!</p>
        </div>
        <div className={`column ${state.speech.use ? '' : 'hide'}`}>
          <p>Use screen reader to read words back to you!</p>
        </div>
        <div className="column">
          <p>Share device with multiple user accounts.</p>
        </div>
      </div>

      <hr />

      <div class={showSelectUser}>

        <p><strong>Have an account?</strong> Choose yours below:</p>
        <ul>
          {state.allUsers.map((user) => (
            <li><a onclick={() => {
              actions.updateCurrentUser(user);
              actions.router.go('/choose-list-type');
            }}>{user.name}</a></li>
          ))}
        </ul>

        <p>Not on this list? Sign up below:</p>

        <hr />
      </div>
      <div>
        <p><strong>Create a free account:</strong></p>

        <form>
          <label for="new-user-name" onsubmit={createNewUser}>
            <input id="new-user-name" name="new-user-name" placeholder="What is your name?" type="text" />
            <p><button onclick={createNewUser}>Create User</button></p>
          </label>
        </form>
      </div>
    </ViewContainer>
  );
};
