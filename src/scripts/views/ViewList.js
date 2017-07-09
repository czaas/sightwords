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

        <p className={hideOnPracticeList}><a onclick={ () => { 
          actions.markComplete(currentWord); 
          actions.setNextWord(); 
        }}>I said it out loud! Move on!</a></p>

        <p><a onclick={ () => {
          if (currentWord.practice) { 
            actions.removeFromPracticeAndMarkComplete(currentWord);
            actions.setNextWord(); 
          } else {
            actions.addToPractice(currentWord);
            actions.setNextWord(); 
          }
        }}>{ (currentWord.practice) ? 'Remove from' : 'Add to' } practice list and continue.</a></p>

      {<p className={showOnPracticeList}><a onclick={() => actions.leaveOnPracticeAndContinue(currentWord)}>Leave on practice list and continue</a></p>}
      </div>
      <div className="list-complete">
        <p>You've completed your { (state.currentListType === 'practice') ? 'practice' : 'normal' } list!</p>

        <p><a onclick={() => actions.router.go('/choose-list-type')}>Choose a different list</a> or <a onclick={() => actions.router.go('/')}>Go Home</a></p>
      </div>
    </ViewContainer>
  );
};