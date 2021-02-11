import React from 'react';
import styles from 'styles/logoLight.module.scss';

const LogoLight = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <rect id="bounds" width="100" height="100" rx="8" fill="#bbb" />
        <clipPath id="clip">
          <use href="#bounds" />
        </clipPath>
      </defs>
      <use href="#bounds" />
      <path
        d="
    M 0,0
    L 100,100
    M 100,0
    L 0,100
  "
        stroke="#eee"
        strokeWidth="3"
        clip-path="url(#clip)"
      />
      <rect width="84" height="84" x="8" y="8" rx="4" stroke="#eee" strokeWidth="4" fill="#bbb" />
      <g className={styles.lettering}>
        <path
          d="
      M 42,37
      L 42,63
      M 42,63
      L 50,63
      A 7 6 0 1 0 50,49
      A 7 6 0 1 0 50,37
      L 42,37
      M 42,49
      L 50,49
    "
        />
      </g>
    </svg>
  );
};

export default LogoLight;
