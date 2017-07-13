'use strict';

if (module.hot) {
  module.hot.accept();
}

import '../styles/index.scss';

import {  app } from 'hyperapp';
import { Router } from 'hyperapp-router';

import shortid from 'shortid';
import 'whatwg-fetch';

import { Home } from './views/Home.js';
import { ChooseListType } from './views/ChooseListType.js';
import { ViewList } from './views/ViewList.js';
import { ManageAccount } from './views/ManageAccount.js';


import ManageAccountObject from './views/ManageAccount.js';



app({
  mixins: [Router],
  root: document.getElementById('mount'),

  state: {
    allUsers: [],
    currentUser: {},
    currentListType: 'default', // default || practice
    currentWord: {},
    showCongratsScreen: false,
  },

  actions: {
    // User actions
    updateCurrentUser: (state, actions, data, emit) => {
      state.currentUser = data;

      return state;
    },
    updateAllUsers: (state, actions, data, emit) => {
      state.allUsers = data;

      return state;
    },
    createNewUser: (state, actions, data, emit) => {
      emit('saveNewUser', data);
      actions.router.go('/choose-list-type');
    },
    
    // List Type actions
    updateGameType: (state, actions, data, emit) => {
      state.currentListType = data;

      actions.setNextWord();
      actions.router.go('/list');
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
      var mightBeNextWord = [];
      var nextWord = {};
      var foundWord = false;

      // Finding and updateing 
      for (var i = 0; i < state.currentUser.list.length; i++)  {
        var currentWord = state.currentUser.list[i];

        if (currentWord.id === data.id) {
          currentWord.practice = false;
          currentWord.complete = true;

          foundWord = true;
        }

        state.currentUser.list[i] = currentWord;

        if (foundWord) {
          i = state.currentUser.list.length;
        }
      }

      actions.setNextWord();
      actions.updateUser({ currentUser: state.currentUser });
    },
    leaveOnPracticeAndContinue: (state, actions, data) => {
      let setWordData = {
        sequenceToSkip: data.sequence,
      };

      actions.setNextWord(setWordData);
    },
    goBackOneWord: (state, actions, data) => {
      let previousWord = undefined;

      if (data.sequence > 1) {
        if (state.currentListType === 'practice') {
          let tempList = [];
          let previousWords = state.currentUser.list.forEach((words) => {
            if (words.practice && words.sequence < data.sequence) {
              tempList.push(words);
            }
          });

          previousWord = tempList.sort((a, b) => a.sequence - b.sequence)[tempList.length - 1];

        } else {
          previousWord = state.currentUser.list.filter((word) => word.sequence === data.sequence - 1)[0];
        }
      }

      if (previousWord) {
        state.currentWord = previousWord;
      }

      return state;
    },
    setNextWord: (state, actions, data) => {
      let foundWord = false;
      let word = {};

      if (state.currentUser.list) {
        for (let i = 0; i < state.currentUser.list.length; i++) {
          let currentWord = state.currentUser.list[i];
          if (state.currentListType === 'default') {
            if (!currentWord.complete && !currentWord.practice) {
              foundWord = true;
              word = currentWord;
            }
          } else if (state.currentListType === 'practice') {
            if (data && data.sequenceToSkip) {
              if (currentWord.practice && currentWord.sequence > data.sequenceToSkip) {
                foundWord = true;
                word = currentWord;
              }
            } else if (currentWord.practice) {
              foundWord = true;
              word = currentWord;
            }
          }

          if (foundWord) {
            i = state.currentUser.list.length;
          }
        }
      }

      state.currentWord = word;

      return state;
    },


    /** # manage account */
    updateUser: (state, actions, data, emit) => {
      state.currentUser = Object.assign({}, data.currentUser, state.currentUser);

      emit('saveCurrentUser');
      return state;
    },

    /**
    ## resetList
    ## resetStateList

    - Looks on the element that was clicked for a `listType` value.
    - loops through currentUserList
    - emits to save user and fires an action to update state
    */
    resetList: (state, actions, data, emit) => {

      var list = data.listType;


      var newList = [];

      for (var i = 0; i < state.currentUser.list.length; i++) {
        var currentWord = state.currentUser.list[i];

        switch(list) {
          case 'main':
            currentWord.complete = false;
            break;
          case 'practice':
            currentWord.practice = false;
            break;

          default:
            break;
        }

        newList.push(currentWord);
      }

      actions.resetStateList(newList);
      emit('saveCurrentUser');
    },
    resetStateList: (state, actions, dataList) => {
      state.currentUser.list = dataList;
      return state;
    },

    /**
    ## saveName
    ## stateSaveName
    data.name = "new user name"
    - saveName is fired by save state.
     - fires stateSaveName
     - emits [saveCurrentUser](actions.saveCurrentUser)
    */

    saveName: (state, actions, data, emit) => {
      actions.stateSaveName({ name: data.name});
      emit('saveCurrentUser');
    },
    stateSaveName: (state, actions, data) => {
      state.currentUser.name = data.name;
      return state;
    },

    /**
    ## deleteUser 
    */
    deleteUser: (state, actions, data, emit) => {
      emit('deleteUser');

      actions.updateCurrentUser({});
    },
  },

  events: {
    update: (state) => {
      // console.log(state);
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
    deleteUser: (state, actions, data) => {
      let allUsers = JSON.parse(localStorage.getItem('sightwords--allUsers'));
      let oneLessUser = [];

      for (var i= 0; i < state.allUsers.length; i++) {
        if (state.allUsers[i].id !== state.currentUser.id) {
          oneLessUser.push(state.allUsers[i]);
        }
      }

      actions.updateAllUsers(oneLessUser);
      localStorage.setItem('sightwords--allUsers', JSON.stringify(oneLessUser));
    },
  },

  view: [
    ['/', Home],
    ['/choose-list-type', ChooseListType],
    ['/list', ViewList],
    ['/manage-account', ManageAccount],
  ],
});