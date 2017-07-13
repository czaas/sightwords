import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const Home = (state, actions, data, emit) => {

  let showSelectUser = state.allUsers.length >= 1 ? '' : 'hide';

  function createNewUser(e) {
    if (e) { e.preventDefault(); }

    let newNameElement = document.getElementById('new-user-name');

    let newName = newNameElement.value;
    actions.createNewUser(newName);

    newNameElement.value = '';
  }

  return (
    <ViewContainer state={state} actions={actions} className='home'>
      <h1>Sight Words</h1>

      <div class={showSelectUser}>
        <h2>Who are you?</h2>
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
        <h2>What is your name?</h2>

        <form>
          <label for="new-user-name" onsubmit={createNewUser}>
            <input id="new-user-name" name="new-user-name" />
            <p><button onclick={createNewUser}>Create User</button></p>
          </label>
        </form>
      </div>
    </ViewContainer>
  );
};
