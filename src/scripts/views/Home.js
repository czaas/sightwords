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
      
      <p>A list of words to see and memorize on sight. This application will help you track your words, add to a practice list, and read words back to you.</p>

      <hr />

      <div class="row inversed-bg">
        <div class={`column ${showSelectUser}`}>
          <p><strong>Have an account?</strong></p>
          <ul>
            {state.allUsers.map((user) => (
              <li><a onclick={() => {
                actions.updateCurrentUser(user);
                actions.router.go('/choose-list-type');
              }}>{user.name}</a></li>
            ))}
          </ul>
        </div>
        <div className="column">
          <p className="center"><strong><span class={showSelectUser}>Or </span>create an account:</strong></p>

          <form>
            <label for="new-user-name" onsubmit={createNewUser}>
              <input id="new-user-name" name="new-user-name" placeholder="What is your name?" type="text" />
              <p><button onclick={createNewUser}>Create User</button></p>
            </label>
          </form>
        </div>
      </div>

      <hr />

      <div className="row">
        <div className="column">
          <p className="center">
            <svg width="120" height="120" viewBox="0 0 2304 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1774 836l18 316q4 69-82 128t-235 93.5-323 34.5-323-34.5-235-93.5-82-128l18-316 574 181q22 7 48 7t48-7zm530-324q0 23-22 31l-1120 352q-4 1-10 1t-10-1l-652-206q-43 34-71 111.5t-34 178.5q63 36 63 109 0 69-58 107l58 433q2 14-8 25-9 11-24 11h-192q-15 0-24-11-10-11-8-25l58-433q-58-38-58-107 0-73 65-111 11-207 98-330l-333-104q-22-8-22-31t22-31l1120-352q4-1 10-1t10 1l1120 352q22 8 22 31z"/></svg>
          </p> 
          <p>Learn and practice <strong>1000 sight words</strong>!</p>
        </div>
        <div className={`column ${state.speech.use ? '' : 'hide'}`}>
          <p className="center">
            <svg width="120" height="120" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M832 352v1088q0 26-19 45t-45 19-45-19l-333-333h-262q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h262l333-333q19-19 45-19t45 19 19 45zm384 544q0 76-42.5 141.5t-112.5 93.5q-10 5-25 5-26 0-45-18.5t-19-45.5q0-21 12-35.5t29-25 34-23 29-36 12-56.5-12-56.5-29-36-34-23-29-25-12-35.5q0-27 19-45.5t45-18.5q15 0 25 5 70 27 112.5 93t42.5 142zm256 0q0 153-85 282.5t-225 188.5q-13 5-25 5-27 0-46-19t-19-45q0-39 39-59 56-29 76-44 74-54 115.5-135.5t41.5-173.5-41.5-173.5-115.5-135.5q-20-15-76-44-39-20-39-59 0-26 19-45t45-19q13 0 26 5 140 59 225 188.5t85 282.5zm256 0q0 230-127 422.5t-338 283.5q-13 5-26 5-26 0-45-19t-19-45q0-36 39-59 7-4 22.5-10.5t22.5-10.5q46-25 82-51 123-91 192-227t69-289-69-289-192-227q-36-26-82-51-7-4-22.5-10.5t-22.5-10.5q-39-23-39-59 0-26 19-45t45-19q13 0 26 5 211 91 338 283.5t127 422.5z"/></svg>
          </p>
          <p>Use screen reader to read words back to you!</p>
        </div>
        <div className="column">
          <p className="center">
            <svg width="120" height="120" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg"><path d="M657 896q-162 5-265 128h-134q-82 0-138-40.5t-56-118.5q0-353 124-353 6 0 43.5 21t97.5 42.5 119 21.5q67 0 133-23-5 37-5 66 0 139 81 256zm1071 637q0 120-73 189.5t-194 69.5h-874q-121 0-194-69.5t-73-189.5q0-53 3.5-103.5t14-109 26.5-108.5 43-97.5 62-81 85.5-53.5 111.5-20q10 0 43 21.5t73 48 107 48 135 21.5 135-21.5 107-48 73-48 43-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-1024-1277q0 106-75 181t-181 75-181-75-75-181 75-181 181-75 181 75 75 181zm704 384q0 159-112.5 271.5t-271.5 112.5-271.5-112.5-112.5-271.5 112.5-271.5 271.5-112.5 271.5 112.5 112.5 271.5zm576 225q0 78-56 118.5t-138 40.5h-134q-103-123-265-128 81-117 81-256 0-29-5-66 66 23 133 23 59 0 119-21.5t97.5-42.5 43.5-21q124 0 124 353zm-128-609q0 106-75 181t-181 75-181-75-75-181 75-181 181-75 181 75 75 181z"/></svg>
          </p>
          <p>Share device with multiple user accounts.</p>
        </div>
      </div>
    </ViewContainer>
  );
};
