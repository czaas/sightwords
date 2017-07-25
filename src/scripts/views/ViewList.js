import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';
import { SoundIcon } from './../components/icons.js';

export const ViewList = (state, actions, data, emit) => {
  let currentWord = state.currentWord;

  var prevDisabled = '';
  var nextDisabled = '';

  if (state.previousWord && !state.previousWord.id) {
    prevDisabled = 'disabled';
  }
  if (!state.nextWord.id) {
    nextDisabled = 'disabled';
  }

  function formChange(e) {
    if (e) { e.preventDefault(); }

    var complete = document.getElementById('complete').checked;
    var practice = document.getElementById('practice').checked;

    currentWord.complete = complete;
    currentWord.practice = practice;
    
    actions.updateCurrentWord(currentWord);
    document.getElementById('next-word').click();
  }

  return (
    <ViewContainer state={state} actions={actions} className={`view-list`}>
      <div className="current-word" currentWordSequnce={(state.currentWord.word) ? state.currentWord.sequence : ''}>
        <h1>{ currentWord.word }</h1>

        <p className={(state.currentListType === 'practice') ? 'hide' : ''}>All words list<br /> {state.currentWord.sequence} / {state.currentUser.list.length}</p>
        <p className={(state.currentListType === 'all') ? 'hide' : ''}>Your practice<br /> {state.currentUser.list.filter((word) => word.practice).indexOf(state.currentWord) + 1} / {state.currentUser.list.filter((word) => word.practice).length}</p>

        <p className={state.speech.use ? '' : 'hide'}  onclick={() => actions.readWord(currentWord.word)}><SoundIcon /></p>

        <form onchange={formChange}>
          <label for="complete">
            Complete
            <input type="checkbox" id="complete" name="complete" value="true" checked={state.currentWord.complete} />
          </label>

          <label for="practice">
            Practice
            <input type="checkbox" id="practice" name="practice" value="true" checked={state.currentWord.practice} />
          </label>
        </form>

        <hr />

        <p className="prev-next-buttons"><a className={`${prevDisabled} button button-outline`} onclick={() => {
          actions.router.go(`/list/${state.currentListType}/${state.previousWord.id}`);
        }}>Previous</a>
        <a className={`${nextDisabled}  button button-outline`} id="next-word" onclick={() => {
          actions.router.go(`/list/${state.currentListType}/${state.nextWord.id}`);
        }}>Next</a></p>
      </div>
    </ViewContainer>
  );
};