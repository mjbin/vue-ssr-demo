import serialize from 'serialize-javascript';

export function envMarkup(env) { //eslint-disable-line
  return `<script>window.env = ${serialize(env)}</script>`;
}
