import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const ViewList = (state, actions, data, emit) => {
  let currentWord = state.currentWord;
  let noMoreWordsOnList = (!currentWord.word) ? 'show-list-complete' : '';
  let disableOnPracticeList = (state.currentListType === 'practice') ? 'disabled' : '';
  let disableIfNotPracticeWord = (!currentWord.practice) ? 'disabled' : '';
  let isCompleteText = (currentWord.complete) ? 'Remove from completed list.' : 'I said it out loud! Continue.';

  var prevDisabled = '';
  var nextDisabled = '';

  if (!state.previousWord.id) {
    prevDisabled = 'disabled';
  }
  if (!state.nextWord.id) {
    nextDisabled = 'disabled';
  }


  function formChange(e) {
    if (e) { e.preventDefault(); }

    var complete = document.getElementById('complete');
    var practice = document.getElementById('practice');

    console.log(complete, practice);
  } 

  return (
    <ViewContainer state={state} actions={actions} className={`play-game ${ noMoreWordsOnList }`}>
      <div className="current-word" currentWordSequnce={(state.currentWord.word) ? state.currentWord.sequence : ''}>
        <h2>{ currentWord.word }</h2>

        <form onchange={formChange}>
          <label for="complete">
            Complete
            <input type="checkbox" id="complete" name="complete" />
          </label>
          <br />
          <label for="practice">
            Practice
            <input type="checkbox" id="practice" name="practice" />
          </label>
        </form>

        <hr />

        <p><a className={prevDisabled} onclick={() => actions.router.go(`/list/${state.currentListType}/${state.previousWord.id}`)}>Previous</a>
        <a className={nextDisabled} onclick={() => actions.router.go(`/list/${state.currentListType}/${state.nextWord.id}`)}>Next</a></p>
      </div>

      {/*
        When the current list is empty or has passed the last word, this message will be displayed.
      */}
      <div className="list-complete">
        <p>You've completed { (state.currentListType === 'practice') ? 'your practice list' : 'all of your sight words' }!</p>

        <p><a onclick={() => actions.router.go('/choose-list-type')}>Choose a different list</a> or <a onclick={() => actions.router.go('/')}>Go Home</a></p>
      </div>
    </ViewContainer>
  );
};