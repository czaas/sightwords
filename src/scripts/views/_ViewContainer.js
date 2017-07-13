import { h } from 'hyperapp';

const Nav = ({ state, actions }) => {
  let showAccountLinks = (state.currentUser && state.currentUser.name) ? '' : 'hide';
  return (
    <nav className="bottomBar">
      <a onclick={() => actions.router.go('/')}>Home</a>
      <a className={showAccountLinks} onclick={() => actions.router.go('/manage-account')}>Manage account<br />{ state.currentUser.name }</a>
      <a className={showAccountLinks} onclick={() => actions.router.go('/choose-list-type')}>Choose List</a>
    </nav>
  );
};

export const ViewContainer = ({state, actions, className}, data) => {
  return (
    <main class={className}>
      {data}

      <Nav state={state} actions={actions} />
    </main>
  );
};