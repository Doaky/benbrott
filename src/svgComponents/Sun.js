import React from 'react';

class Sun extends React.PureComponent {
  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <defs>
          <mask id="sunMask">
            <rect width="100" height="100" fill="#fff"/>
            <circle cx="50" cy="50" r="30" fill="#000"/>
          </mask>
          <polygon id="triangle" points="50,5 57,25 43,25"/>
        </defs>
        <circle cx="50" cy="50" r="23" fill="#eee"/>
        <g mask="url(#sunMask)" fill="#eee">
          <use href="#triangle"/>
          <use href="#triangle" transform="rotate(45, 50, 50)"/>
          <use href="#triangle" transform="rotate(90, 50, 50)"/>
          <use href="#triangle" transform="rotate(135, 50, 50)"/>
          <use href="#triangle" transform="rotate(180, 50, 50)"/>
          <use href="#triangle" transform="rotate(225, 50, 50)"/>
          <use href="#triangle" transform="rotate(270, 50, 50)"/>
          <use href="#triangle" transform="rotate(315, 50, 50)"/>
        </g>
      </svg>
    );
  }
}

export default Sun;