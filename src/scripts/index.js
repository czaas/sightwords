'use strict';

if (module.hot) {
  module.hot.accept();
}

import '../styles/index.scss';

import { 
  app,
  h,
} from 'hyperapp';
import { Router } from 'hyperapp-router';
import shortid from 'shortid';

import 'whatwg-fetch';

const ViewContainer = ({state, actions, className}, data) => {
  return (
    <main class={className}>
      {data}
    </main>
  );
};

const Home = (state, actions, data, emit) => {

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
      <div class={showSelectUser}>
        <h2>Select user</h2>
        <ul>
          {state.allUsers.map((user) => (
            <li><a onclick={() => {
              actions.updateCurrentUser(user);
              actions.router.go('/choose-list-type');
            }}>{user.name}</a></li>
          ))}
        </ul>

        <p>or</p>
      </div>
      <div>
        <h2>Create new user</h2>

        <form>
          <label for="new-user-name" onsubmit={createNewUser}>
            <input id="new-user-name" name="new-user-name" />
            <button onclick={createNewUser}>Create User</button>
          </label>
        </form>
      </div>
    </ViewContainer>
  );
};

const ChooseListType = (state, actions, data, emit) => {
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

const PlayGame = (state, actions, data, emit) => {
  /*
  - Need to determine which word to display depending on state.currentListType 
  - Update current word based on user action, (complete or add to practice)... then move onto next word. 
  - "Add to" or "Remove from" depending on if word is on practice list already. 
  - Here is where we check for if user current complete word (wordCompletionCount % 100 === 0) then show congratulations screen.
  */
  function getNextWord() {
    let foundWord = false;
    let word = '';

    if (state.currentUser.list) {
      for (let i = 0; i < state.currentUser.list.length; i++) {
        let currentWord = state.currentUser.list[i];

        if (state.currentListType === 'default') {
          if (!currentWord.complete && !currentWord.practice) {
            foundWord = true;
            word = currentWord;
          }
        } else if (state.currentListType === 'practice') {
          if (currentWord.practice) {
            foundWord = true;
            word = currentWord;
          }
        }

        if (foundWord) {
          i = state.currentUser.list.length;
        }
      }
    }

    return word;
  }

  let currentWord = getNextWord();
  let noMoreWordsOnList = (currentWord === '') ? 'show-list-complete' : '';
  let hideOnPracticeList = (state.currentListType === 'practice') ? 'hide' : '';

  return (
    <ViewContainer state={state} actions={actions} className={`play-game ${ noMoreWordsOnList }`}>
      <div className="current-word">
        <h2>{ currentWord.word }</h2>

        <p className={hideOnPracticeList}><a onclick={ () => actions.markComplete(currentWord) }>I said it out loud! Move on!</a></p>
        <p><a onclick={ () => {
          if (currentWord.practice) { 
            actions.removeFromPracticeAndMarkComplete(currentWord);
          } else {
            actions.addToPractice(currentWord);
          }
        }}>{ (currentWord.practice) ? 'Remove from' : 'Add to' } practice list and continue.</a></p>
      </div>
      <div className="list-complete">
        <p>You've completed your { (state.currentListType === 'practice') ? 'practice' : 'normal' } list!</p>

        <p><a onclick={() => actions.router.go('/choose-list-type')}>Choose a different list</a> or <a onclick={() => actions.router.go('/')}>Go Home</a></p>
      </div>
    </ViewContainer>
  );
};

const CompletedListScreen = (state, actions, data, emit) => {
  let message = (state.currentListType === 'default') ? 'all the words' : 'your practice list';
  return (
    <ViewContainer state={state} actions={actions} className="completed-list">
      <h2>Congratulations, you've completed {message}!</h2>
    </ViewContainer>
  );
};

app({
  mixins: [Router],
  root: document.getElementById('mount'),

  state: {
    allUsers: [],
    currentUser: {},
    currentListType: 'default', // default/practice
    currentWord: {},
    showCongratsScreen: false,
  },

  actions: {
    // User actions
    updateCurrentUser: (state, actions, data, emit) => {
      state.currentUser = data;
      // actions.router.go('/choose-list-type');
      return state;
    },
    updateAllUsers: (state, actions, data, emit) => {
      state.allUsers = data;

      return state;
    },
    createNewUser: (state, actions, data, emit) => {
      emit('saveNewUser', data);
      return state;
    },
    
    // List Type actions
    updateGameType: (state, actions, data, emit) => {
      state.currentListType = data;

      actions.router.go('/play-game');
      return state;
    },

    // Game list actions
    markComplete: (state, actions, data, emit) => {
      state.currentUser.list = state.currentUser.list.map((word) => {
        if (word.id === data.id) {
          word.complete = true;
        }

        return word;
      });

      emit('saveCurrentUser');
      return state;
    },
    addToPractice: (state, actions, data, emit) => {
      state.currentUser.list = state.currentUser.list.map((word) => {
        if (word.id === data.id) {
          word.practice = true;
        }

        return word;
      });

      emit('saveCurrentUser');
      return state;
    },
    removeFromPracticeAndMarkComplete: (state, actions, data, emit) => {
      state.currentUser.list = state.currentUser.list.map((word) => {
        if (word.id === data.id) {
          word.practice = false;
          word.complete = true;
        }

        return word;
      });

      emit('saveCurrentUser');
      return state;
    },
    toggleShowCongratsScreen: (state, actions, data) => {
      state.showCongratsScreen = data;

      return state;
    },
  },

  events: {
    update: (state) => {
      //console.log(state);
    },
    loaded: (state, actions, data, emit) => {
      emit('checkAndFetchListIfNeeded');
      emit('getAllUsers');
    },
    checkAndFetchListIfNeeded: (state, actions) => {
      let listRef = localStorage.getItem('sightwords--list');

      if (!listRef) {
        fetch('http://sightwords.czaas.com/sight-words-list.json', {
          'content-type': 'application/json',
          'cors': '*',
        })
          .then((res) => res.json())
          .then((json) => {
            localStorage.setItem('sightwords--list', JSON.stringify(json));
          });
      }
    },
    getAllUsers: (state, actions) => {
      let allUsers = localStorage.getItem('sightwords--allUsers');

      if (allUsers) {
        actions.updateAllUsers(JSON.parse(allUsers));
        // will update once we have users in here ... 
        // can't seem to save empy array as an item
      }
    },
    saveNewUser: (state, actions, data) => {
      let listRef = localStorage.getItem('sightwords--list');
      let allUsers = localStorage.getItem('sightwords--allUsers');
      
      let newUser = {
        id: shortid.generate(),
        list: JSON.parse(listRef),
        name: data,
        haveSeenCongratsFor: [],
      };

      /*
      If allUsers localStorage exist:
        - Add User to list
      Else
        - Create new list and add user to list
      */
      if (allUsers) {
        let allUsersList = JSON.parse(allUsers);

        allUsersList.push(newUser);

        localStorage.setItem('sightwords--allUsers', JSON.stringify(allUsersList));
        actions.updateAllUsers(allUsersList);
        actions.updateCurrentUser(newUser);
      } else {
        let newAllUsers = [newUser];

        localStorage.setItem('sightwords--allUsers', JSON.stringify(newAllUsers));

        actions.updateAllUsers(newAllUsers);
      }

      actions.updateCurrentUser(newUser);
    },
    saveCurrentUser: (state, actions, data) => {
      let allUsers = JSON.parse(localStorage.getItem('sightwords--allUsers'));
      allUsers = allUsers.map((user) => {
        if (user.id === state.currentUser.id) {
          return state.currentUser;
        }
        return user;
      });
      actions.updateAllUsers(allUsers);
      localStorage.setItem('sightwords--allUsers', JSON.stringify(allUsers));
    },
  },

  view: [
    ['/', Home],
    ['/choose-list-type', ChooseListType],
    ['/play-game', PlayGame],
    ['/completed-list', CompletedListScreen],
  ],
});