// Shim: re-wraps CSSResult objects from lit-element 2.x dependencies (granite-lit-bulma,
// lit-fontawesome) so they are compatible with lit-element 4.x / lit 3.x CSSResult checks.
// lit 3 uses instanceof CSSResult from its own scope; old CSSResult objects fail that check.
// unsafeCSS(cssText) creates a valid lit 3 CSSResult from raw CSS text.
import { unsafeCSS } from 'lit-element';
import { bulmaStyles as _bulmaStyles } from '@granite-elements/granite-lit-bulma/granite-lit-bulma.js';
import _Fontawesome from 'lit-fontawesome';

export const bulmaStyles = unsafeCSS(_bulmaStyles.cssText);
export const Fontawesome = unsafeCSS(_Fontawesome.cssText);
