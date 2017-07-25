import { h } from 'hyperapp';
import { ViewContainer } from './_ViewContainer.js';
import { SoundIcon } from './../components/icons.js';

export const ViewListGroup = (state, actions) => {
  if (!state.router.params.range) {
    actions.router.go('/');
  }

  var range = state.router.params.range.split('-');
  var rangeStart = parseInt(range[0], 10);
  var rangeEnd = parseInt(range[1], 10);

  var listOfWords = [];

  for (var i = rangeStart; i <= rangeEnd; i++) {
    var currentListItemIndex = i - 1;

    if (state.currentUser.list[currentListItemIndex]) {
      listOfWords.push(state.currentUser.list[currentListItemIndex]);
    }
  }

  function changeInput(currentWord) {
    var complete = document.getElementById(`${currentWord.id}-complete`).checked;
    var practice = document.getElementById(`${currentWord.id}-practice`).checked;

    currentWord.complete = complete;
    currentWord.practice = practice;
    
    actions.updateCurrentWord(currentWord);
  }

  var htmlListOfWords = listOfWords.map((word) => (
    <tr key={`word-${word.word}`}>
      <td>{word.sequence}</td>
      <td>{word.word}</td>
      <td className={state.speech.use ? '' : 'hide'} onclick={() => actions.readWord(word.word)}><SoundIcon /></td>
      <td><input type="checkbox" onchange={() => changeInput(word)} id={`${word.id}-complete`} name="complete" value="true" checked={word.complete} /></td>
      <td><input type="checkbox" onchange={() => changeInput(word)} id={`${word.id}-practice`} name="practice" value="true" checked={word.practice} /></td>
    </tr>
  ));

  return (
    <ViewContainer state={state} actions={actions} className={`view-group-list`}>
    <h1>Words by group</h1>
    <table>
      <tr>
        <th>#</th><th>Word</th><th>Complete</th><th>Practice</th>
      </tr>
      {htmlListOfWords}
    </table>
    </ViewContainer>
  );
};