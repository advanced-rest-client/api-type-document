import { css } from 'lit-element';

export default css`
  :host {
    display: block;
    font-size: var(--arc-font-body1-font-size);
    font-weight: var(--arc-font-body1-font-weight);
    line-height: var(--arc-font-body1-line-height);
  }

  property-shape-document {
    padding: 12px 0;
  }

  property-shape-document:last-of-type,
  :last-of-type {
    border-bottom: none;
  }

  .array-children {
    box-sizing: border-box;
    padding-left: 12px;
    border-left: 2px var(--property-shape-document-array-color, #8bc34a) solid;
  }

  :host([hasparenttype]) .array-children {
    padding-left: 0px;
    border-left: none;
  }

  .inheritance-label {
    font-size: var(--api-type-document-inheritance-label-font-size, 16px);
  }

  .media-type-selector {
    margin: 20px 0;
  }

  .media-toggle {
    outline: none;
    color: var(--api-type-document-media-button-color, #000);
    background-color: var(
      --api-type-document-media-button-background-color,
      #fff
    );
    border-width: 1px;
    border-color: var(--api-type-document-media-button-border-color, #a3b11d);
    border-style: solid;
  }

  .media-toggle[activated] {
    background-color: var(
      --api-type-document-media-button-active-background-color,
      #cddc39
    );
  }

  .union-toggle,
  .one-of-toggle {
    outline: none;
    background-color: var(
      --api-type-document-union-button-background-color,
      #fff
    );
    color: var(--api-type-document-union-button-color, #000);
    border-width: 1px;
    border-color: var(--api-type-document-media-button-border-color, #a3b11d);
    border-style: solid;
  }

  .union-toggle[activated],
  .one-of-toggle[activated] {
    background-color: var(
      --api-type-document-union-button-active-background-color,
      #cddc39
    );
    color: var(--api-type-document-union-button-active-color, #000);
  }

  .union-type-selector {
    margin: 12px 0;
  }
`;
