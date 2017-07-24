import { h } from 'hyperapp';

const iconWidthAndHeight = 26;

const HomeIcon = () => (
  <svg width={iconWidthAndHeight} height={iconWidthAndHeight} viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1472 992v480q0 26-19 45t-45 19h-384v-384h-256v384h-384q-26 0-45-19t-19-45v-480q0-1 .5-3t.5-3l575-474 575 474q1 2 1 6zm223-69l-62 74q-8 9-21 11h-3q-13 0-21-7l-692-577-692 577q-12 8-24 7-13-2-21-11l-62-74q-8-10-7-23.5t11-21.5l719-599q32-26 76-26t76 26l244 204v-195q0-14 9-23t23-9h192q14 0 23 9t9 23v408l219 182q10 8 11 21.5t-7 23.5z" fill="#fff" /></svg>
);
const ChoostListIcon = () => (
  <svg width={iconWidthAndHeight} height={iconWidthAndHeight} viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M384 1408q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm0-512q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5zm-1408-928q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm1408 416v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5zm0-512v192q0 13-9.5 22.5t-22.5 9.5h-1216q-13 0-22.5-9.5t-9.5-22.5v-192q0-13 9.5-22.5t22.5-9.5h1216q13 0 22.5 9.5t9.5 22.5z" fill="#fff" /></svg>
);
const CurrentUserIcon = () => (
  <svg width={iconWidthAndHeight} height={iconWidthAndHeight} viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1523 1339q-22-155-87.5-257.5t-184.5-118.5q-67 74-159.5 115.5t-195.5 41.5-195.5-41.5-159.5-115.5q-119 16-184.5 118.5t-87.5 257.5q106 150 271 237.5t356 87.5 356-87.5 271-237.5zm-243-699q0-159-112.5-271.5t-271.5-112.5-271.5 112.5-112.5 271.5 112.5 271.5 271.5 112.5 271.5-112.5 112.5-271.5zm512 256q0 182-71 347.5t-190.5 286-285.5 191.5-349 71q-182 0-348-71t-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z" fill="#fff" /></svg>
);

const Nav = ({ state, actions }) => {
  let showAccountLinks = (state.currentUser && state.currentUser.name) ? '' : 'hide';
  return (
    <nav className="bottomBar">
      <a onclick={() => actions.router.go('/')}><HomeIcon /><br />Home</a>
      <a className={showAccountLinks} onclick={() => actions.router.go('/choose-list-type')}><ChoostListIcon /><br /> Choose List</a>
      <a className={showAccountLinks} onclick={() => actions.router.go('/manage-account')}><CurrentUserIcon /><br />{ state.currentUser.name }</a>
    </nav>
  );
};

export const ViewContainer = ({state, actions, className}, data) => {
  return (
    <main class={className}>
      <div className={`notification ${state.notification.show ? 'notification--show' : ''} ${state.notification.type}`} onclick={actions.earlyHideNotification}>
        {state.notification.message}
      </div>
      <section>
        {data}
      </section>

      <Nav state={state} actions={actions} />
    </main>
  );
};