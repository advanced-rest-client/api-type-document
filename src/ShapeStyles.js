import { css } from 'lit-element';

export default css`
  :host {
    display: block;
    border-bottom-width: 1px;
    border-bottom-color: var(
      --property-shape-document-border-bottom-color,
      #cfd8dc
    );
    border-bottom-style: var(
      --property-shape-document-border-bottom-style,
      dashed
    );
    padding: var(--property-shape-document-padding);
  }

  :host(:last-of-type) {
    border-bottom: none;
  }

  [hidden] {
    display: none !important;
  }

  .property-title {
    font-size: var(
      --property-shape-document-title-font-size,
      var(--arc-font-subhead-font-size)
    );
    font-weight: var(
      --property-shape-document-title-font-weight,
      var(--arc-font-subhead-font-weight)
    );
    line-height: var(
      --property-shape-document-title-line-height,
      var(--arc-font-subhead-line-height)
    );

    margin: 4px 0 4px 0;
    font-size: 1rem;
    font-weight: var(--api-type-document-property-title-font-weight, 500);
    word-break: break-word;
    color: var(--api-type-document-property-title-color);
  }

  .property-title[secondary] {
    font-weight: var(
      --api-type-document-property-title-secondary-font-weight,
      400
    );
    color: var(--api-type-document-property-title-secondary-color, #616161);
  }

  .parent-label {
    color: var(--api-type-document-property-parent-color, #757575);
  }

  .property-display-name {
    font-weight: var(--api-type-document-property-name-font-weight, 500);
    color: var(
      --api-type-document-property-name-color,
      var(--api-type-document-property-color, #212121)
    );
    margin: 4px 0 4px 0;
    font-size: var(--api-type-document-property-name-font-size, 16px);
  }

  api-type-document,
  property-range-document {
    transition: background-color 0.4s linear;
  }

  :host([isobject]) api-type-document.complex,
  :host([isunion]) api-type-document.complex,
  :host([isarray]) api-type-document.complex {
    padding-left: var(--api-type-document-child-docs-padding-left, 20px);
    margin-left: var(--api-type-document-child-docs-margin-left, 0px);
    padding-right: var(--api-type-document-child-docs-padding-right, initial);
  }

  :host([isobject]) api-type-document,
  :host([isobject]) property-range-document {
    border-left-color: var(--property-shape-document-object-color, #ff9800);
    border-left-width: 2px;
    border-left-style: solid;
    padding-left: 12px;
  }

  :host([isarray]) api-type-document,
  :host([isarray]):not([isscalararray]) property-range-document {
    border-left: 2px var(--property-shape-document-array-color, #8bc34a) solid;
    padding-left: 12px;
  }

  :host([isunion]) api-type-document,
  :host([isunion]) property-range-document {
    border-left: 2px var(--property-shape-document-union-color, #ffeb3b) solid;
    padding-left: 12px;
  }

  .property-traits {
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
    -ms-flex-direction: row;
    flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .property-traits > span {
    display: inline-block;
    margin-right: 8px;
    padding: var(--api-type-document-trait-padding, 2px 4px);
    background-color: var(--api-type-document-trait-background-color, #eeeeee);
    color: var(--api-type-document-trait-color, #616161);
    border-radius: var(--api-type-document-trait-border-radius, 3px);
    font-size: var(--api-type-document-trait-font-size, 13px);
  }

  .property-traits > span.data-type {
    background-color: var(--api-type-document-type-background-color, #1473bf);
    color: var(--api-type-document-type-color, white);
    padding: var(--api-type-document-trait-data-type-padding, 2px 4px);
    font-weight: var(--api-type-document-trait-data-type-font-weight, normal);
  }

  arc-marked {
    background-color: transparent;
    padding: 0;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .link-label {
    text-decoration: underline;
    cursor: pointer;
  }

  .shape-header {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
    flex-direction: row;
    -ms-flex-align: center;
    align-items: start;
  }

  .name-area {
    -ms-flex: 1;
    flex: 1;
  }
  
  .property-traits > span.readonly-type {
    background-color: var(--api-type-readonly-property-background-color, #ff9292);
    color: var(--api-type-readonly-property-color, black);
  }
`;
