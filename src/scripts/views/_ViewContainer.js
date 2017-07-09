import { h } from 'hyperapp';

export const ViewContainer = ({state, actions, className}, data) => {
  return (
    <main class={className}>
      {data}
    </main>
  );
};