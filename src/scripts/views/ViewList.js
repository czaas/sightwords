import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';

export const ViewList = (state, actions, data, emit) => {
  let currentWord = state.currentWord;
  let noMoreWordsOnList = (!currentWord.word) ? 'show-list-complete' : '';
  let hideOnPracticeList = (state.currentListType === 'practice') ? 'hide' : '';
  let showOnPracticeList = (state.currentListType === 'practice') ? '' : 'hide';

  return (
    <ViewContainer state={state} actions={actions} className={`play-game ${ noMoreWordsOnList }`}>
      <div className="current-word" currentWordSequnce={(state.currentWord.word) ? state.currentWord.sequence : ''}>
        <h2>{ currentWord.word }</h2>

        {/* 
          This button only shows up on main list. 
          - It will mark word complete and set the next word.
        */}
        <p className={hideOnPracticeList}><a onclick={ () => { 
          actions.markComplete(currentWord); 
          actions.setNextWord(); 
        }}>I said it out loud! Move on!</a></p>

        {/* 
          This button shows up on both lists. 
          - If the current word IS NOT on the practice list, this will allow you to add it to the practice list.
          - If the current word IS on the practice list, this will allow you to remove it from the practice list.
        */}
        <p><a onclick={ () => {
          if (currentWord.practice) { 
            actions.removeFromPracticeAndMarkComplete(currentWord);
            actions.setNextWord(); 
          } else {
            actions.addToPractice(currentWord);
            actions.setNextWord(); 
          }
        }}>{ (currentWord.practice) ? 'Remove from' : 'Add to' } practice list and continue.</a></p>

        {/* 
          This button only shows up on practice list. 
          - It will allow the user to move on to next word without removing current word from practice list so they can practice it later.
        */}
        <p className={showOnPracticeList}><a onclick={() => actions.leaveOnPracticeAndContinue(currentWord)}>Leave on practice list and continue</a></p>

        <p><a onclick={() => actions.goBackOneWord(currentWord)}>Go back one</a></p>
      </div>

      {/*
        When the current list is empty or has passed the last word, this message will be displayed.
      */}
      <div className="list-complete">
        <p>You've completed your { (state.currentListType === 'practice') ? 'practice' : 'main' } list!</p>

        <p><a onclick={() => actions.router.go('/choose-list-type')}>Choose a different list</a> or <a onclick={() => actions.router.go('/')}>Go Home</a></p>
      </div>
    </ViewContainer>
  );
};