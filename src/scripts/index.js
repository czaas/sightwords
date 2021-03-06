"use strict";

if (module.hot) {
	module.hot.accept();
}

import "../styles/index.scss";

import { app } from "hyperapp";
import { Router } from "hyperapp-router";

import shortid from "shortid";
import "whatwg-fetch";

import { Home } from "./views/Home.js";
import { ChooseListType } from "./views/ChooseListType.js";
import { ViewList } from "./views/ViewList.js";
import { ViewListGroup } from "./views/ViewListGroup.js";
import { ManageAccount } from "./views/ManageAccount.js";
import { NotFound } from "./views/NotFound.js";

import ManageAccountObject from "./views/ManageAccount.js";
import list from "./sight-words-list";

app({
	mixins: [Router],
	root: document.getElementById("mount"),

	state: {
		allUsers: [],
		currentUser: {},
		currentListType: "all", // all || practice
		currentWord: {},

		previousWord: {},
		nextWord: {},
		notification: {
			show: false,
			message: "",
			type: "",
		},

		speech: {
			useSpeech: false,
			voice: "default",
		},
	},

	actions: {
		updateSpeech: (state, actions, useSpeech) => {
			state.speech.use = useSpeech;

			return state;
		},
		setVoice: (state, actions, synthVoice) => {
			state.speech.voice = synthVoice;

			return state;
		},
		readWord: (state, actions, word) => {
			var synth = window.speechSynthesis;
			if (!synth.speaking) {
				var readThis = new SpeechSynthesisUtterance(word);

				synth.voice = state.speech.voice;
				synth.speak(readThis);
			}
		},

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
			emit("saveNewUser", data);
			actions.router.go("/choose-list-type");
		},

		/**
    
    */
		setCurrentNextAndPrevWord: (state, actions, currentWord, emit) => {
			var wordIdToGet = currentWord;

			switch (state.currentListType) {
				case "all":
					var foundWord = false;

					for (var i = 0; i < state.currentUser.list.length; i++) {
						if (wordIdToGet) {
							if (state.currentUser.list[i].id === wordIdToGet) {
								state.previousWord =
									state.currentUser.list[i - 1] || {};
								state.nextWord =
									state.currentUser.list[i + 1] || {};
								state.currentWord =
									state.currentUser.list[i] || {};

								foundWord = true;
							}
						} else {
							if (!state.currentUser.list[i].complete) {
								state.previousWord =
									state.currentUser.list[i - 1] || {};
								state.nextWord =
									state.currentUser.list[i + 1] || {};
								state.currentWord =
									state.currentUser.list[i] || {};

								foundWord = true;
							}
						}
						if (foundWord) {
							i = state.currentUser.list.length;
						}
					}
					break;
				case "practice":
					var practiceWordsOnly = state.currentUser.list.filter(
						word => word.practice
					);
					var foundWord = false;

					for (var i = 0; i < practiceWordsOnly.length; i++) {
						if (wordIdToGet) {
							if (
								practiceWordsOnly[i].id === wordIdToGet &&
								practiceWordsOnly[i].practice
							) {
								state.previousWord =
									practiceWordsOnly[i - 1] || {};
								state.nextWord = practiceWordsOnly[i + 1] || {};
								state.currentWord = practiceWordsOnly[i] || {};

								foundWord = true;
							}
						} else {
							if (practiceWordsOnly[i].practice) {
								state.previousWord =
									practiceWordsOnly[i - 1] || {};
								state.nextWord = practiceWordsOnly[i + 1] || {};
								state.currentWord = practiceWordsOnly[i] || {};

								foundWord = true;
							}
						}

						if (foundWord) {
							i = practiceWordsOnly.length;
						}
					}
					break;
				default:
					break;
			}

			return state;
		},

		/** # manage account */
		/**
    ## updateCurrentWord
    @param {object} - wordToUpdate is passed in as data value
    This updates a single word when changing the state of complete or practice. 
    */
		updateCurrentWord: (state, actions, wordToUpdate, emit) => {
			var foundWord = false;

			for (var i = 0; i < state.currentUser.list.length; i++) {
				if (state.currentUser.list[i].id === wordToUpdate.id) {
					state.currentUser.list[i] = wordToUpdate;
					foundWord = true;
				}

				if (foundWord) {
					i = state.currentUser.list.length;
				}
			}

			emit("saveCurrentUser");
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

				switch (list) {
					case "main":
						currentWord.complete = false;
						break;
					case "practice":
						currentWord.practice = false;
						break;

					default:
						break;
				}

				newList.push(currentWord);
			}

			actions.resetStateList(newList);
			emit("saveCurrentUser");
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
			actions.stateSaveName({ name: data.name });
			emit("saveCurrentUser");
		},
		stateSaveName: (state, actions, data) => {
			state.currentUser.name = data.name;
			return state;
		},

		/**
    ## deleteUser 
    */
		deleteUser: (state, actions, data, emit) => {
			emit("deleteUser");

			actions.updateCurrentUser({});
		},

		updateList: (state, actions, currentListType) => {
			state.currentListType = currentListType;

			return state;
		},

		displayNotification: (state, actions, data, emit) => {
			// triggers show & hide notification
			var message = data.message;
			var timeout = data.timeout || 1500;
			var type = data.type || "";

			if (message) {
				actions.setNotification(message);
				actions.showNotification(type);

				setTimeout(() => {
					actions.hideNotification();

					setTimeout(() => {
						actions.clearNotification();
					}, 300);
				}, timeout);
			}
		},
		earlyHideNotification: (state, actions) => {
			actions.hideNotification();

			setTimeout(() => {
				actions.clearNotification();
			}, 300);
		},
		showNotification: (state, actions, notificationType) => {
			state.notification.type = notificationType;
			state.notification.show = true;
			return state;
		},
		hideNotification: (state, actions) => {
			state.notification.show = false;
			return state;
		},
		setNotification: (state, actions, message) => {
			state.notification.message = message;
			return state;
		},
		clearNotification: (state, actions) => {
			state.notification.message = "";
			return state;
		},
	},

	events: {
		route: (state, actions, routerParams, emit) => {
			/*
      On route change; check for current list update
      */
			if (
				routerParams.params && // if params exists
				routerParams.params.currentListType && // currentListType param exists
				routerParams.params.currentListType !== state.currentListType
			) {
				// and routeParam not equal to current list

				actions.updateList(routerParams.params.currentListType);
			}

			/*
        On route change; check for current word update
      */
			if (
				state.currentUser.list &&
				routerParams.params.word &&
				routerParams.params.word !== state.currentWord.id
			) {
				actions.setCurrentNextAndPrevWord(routerParams.params.word);
			}

			window.scrollTo(0, 0);
		},
		update: (state, actions) => {
			// console.log(state);
		},
		loaded: (state, actions, data, emit) => {
			emit("checkAndFetchListIfNeeded");
			emit("getAllUsers");

			window.speechSynthesis.onvoiceschanged = function() {
				emit("loadSpeech");
			};
		},

		/**
    reads back words
    */
		loadSpeech: (state, actions) => {
			if ("speechSynthesis" in window) {
				var synth = speechSynthesis;
				var defaultVoice;
				var voices = synth.getVoices();

				for (var i = 0; i < voices.length; i++) {
					defaultVoice = voices[i];

					if (i === 0) {
						i = voices.length;
					}
				}
				actions.setVoice(defaultVoice);
				actions.updateSpeech(true);
			} else {
				actions.updateSpeech(false);
			}
		},

		checkAndFetchListIfNeeded: (state, actions) => {
			let listRef = localStorage.getItem("sightwords--list");

			if (!listRef) {
				localStorage.setItem("sightwords--list", JSON.stringify(list));
			}
		},
		getAllUsers: (state, actions) => {
			let allUsers = localStorage.getItem("sightwords--allUsers");

			if (allUsers) {
				actions.updateAllUsers(JSON.parse(allUsers));
				// will update once we have users in here ...
				// can't seem to save empy array as an item
			}
		},
		saveNewUser: (state, actions, data) => {
			let listRef = localStorage.getItem("sightwords--list");
			let allUsers = localStorage.getItem("sightwords--allUsers");

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

				localStorage.setItem(
					"sightwords--allUsers",
					JSON.stringify(allUsersList)
				);
				actions.updateAllUsers(allUsersList);
				actions.updateCurrentUser(newUser);
			} else {
				let newAllUsers = [newUser];

				localStorage.setItem(
					"sightwords--allUsers",
					JSON.stringify(newAllUsers)
				);

				actions.updateAllUsers(newAllUsers);
			}

			actions.updateCurrentUser(newUser);
		},
		saveCurrentUser: (state, actions, data) => {
			let allUsers = JSON.parse(
				localStorage.getItem("sightwords--allUsers")
			);
			allUsers = allUsers.map(user => {
				if (user.id === state.currentUser.id) {
					return state.currentUser;
				}
				return user;
			});
			actions.updateAllUsers(allUsers);
			localStorage.setItem(
				"sightwords--allUsers",
				JSON.stringify(allUsers)
			);
		},
		deleteUser: (state, actions, data) => {
			let allUsers = JSON.parse(
				localStorage.getItem("sightwords--allUsers")
			);
			let oneLessUser = [];

			for (var i = 0; i < state.allUsers.length; i++) {
				if (state.allUsers[i].id !== state.currentUser.id) {
					oneLessUser.push(state.allUsers[i]);
				}
			}

			actions.updateAllUsers(oneLessUser);
			localStorage.setItem(
				"sightwords--allUsers",
				JSON.stringify(oneLessUser)
			);
		},
	},

	view: [
		["/", Home],
		["/choose-list-type", ChooseListType],
		["/list/:currentListType", ViewList],
		["/list/all/:word", ViewList],
		["/list/practice/:word", ViewList],
		["/list/group/:range", ViewListGroup],
		["/manage-account", ManageAccount],
		["*", NotFound],
	],
});
