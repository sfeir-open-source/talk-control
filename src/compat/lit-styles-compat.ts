import { unsafeCSS } from 'lit-element';
import bulmaCss from 'bulma/css/bulma.min.css?raw';

export const bulmaStyles = unsafeCSS(bulmaCss);

// Minimal CSS to size SVG icons produced by @fortawesome/fontawesome-svg-core
export const faStyles = unsafeCSS(`
  .svg-inline--fa {
    box-sizing: content-box;
    display: inline-block;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
    width: 1.25em;
  }
`);
