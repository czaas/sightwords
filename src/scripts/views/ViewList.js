import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const ViewList = (state, actions, data, emit) => {
  let currentWord = state.currentWord;
  let noMoreWordsOnList = (!currentWord.word) ? 'show-list-complete' : '';
  let disableOnPracticeList = (state.currentListType === 'practice') ? 'disabled' : '';
  let disableIfNotPracticeWord = (!currentWord.practice) ? 'disabled' : '';
  let isCompleteText = (currentWord.complete) ? 'Remove from completed list.' : 'I said it out loud! Continue.';

  return (
    <ViewContainer state={state} actions={actions} className={`play-game ${ noMoreWordsOnList }`}>
      <div className="current-word" currentWordSequnce={(state.currentWord.word) ? state.currentWord.sequence : ''}>
        <h2>{ currentWord.word }</h2>

        {/* 
          This button only shows up on main list. 
          - It will mark word complete and set the next word.
        */}
        <p className={disableOnPracticeList}><a onclick={ () => { 
          if (!currentWord.complete) {
            actions.toggleComplete(currentWord); 
            actions.setNextWord(); 
          } else {
            actions.toggleComplete(currentWord);
          }
        }}>{isCompleteText}</a></p>

        {/* 
          This button shows up on both lists. 
          - If the current word IS NOT on the practice list, this will allow you to add it to the practice list.
          - If the current word IS on the practice list, this will allow you to remove it from the practice list.
        */}
        <p><a onclick={ () => {
          if (currentWord.practice) { 
            actions.removeFromPracticeAndMarkComplete(currentWord);
          } else {
            actions.addToPractice(currentWord);
            actions.setNextWord(); 
          }
        }}>{ (currentWord.practice) ? 'Remove from' : 'Add to' } practice list and continue.</a></p>

        <p><a onclick={() => actions.router.go(`/list/${state.currentListType}/${state.previousWord.id}`)}>Previous</a>
        <a onclick={() => actions.router.go(`/list/${state.currentListType}/${state.nextWord.id}`)}>Next</a></p>
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