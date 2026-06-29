/// <reference types="vite/client" />

declare module 'query-selector-shadow-dom' {
    export function querySelectorAllDeep(selector: string, root?: Element | Document): Element[];
    export function querySelectorDeep(selector: string, root?: Element | Document): Element | null;
}
