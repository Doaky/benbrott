import React from 'react';
import styles from 'styles/logoDark.module.scss';

const LogoNameDark = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 565 210">
      <defs>
        <rect id="bounds" width="100" height="100" rx="8" fill="#111" />
        <clipPath id="clip">
          <use href="#bounds" />
        </clipPath>
        <g id="key">
          <use href="#bounds" />
          <path
            d="
              M 0,0
              L 100,100
              M 100,0
              L 0,100
            "
            stroke="#bbb"
            strokeWidth="3"
            clipPath="url(#clip)"
          />
          <rect width="84" height="84" x="8" y="8" rx="4" stroke="#bbb" strokeWidth="4" fill="#111" />
        </g>
        <g id="bKey">
          <use href="#key" />
          <path
            className={styles.lettering}
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
        <g id="eKey">
          <use href="#key" />
          <path
            className={styles.lettering}
            d="
              M 43,37
              L 43,63
              M 43,37
              L 57,37
              M 43,50
              L 55,50
              M 43,63
              L 57,63                 
            "
          />
        </g>
        <g id="nKey">
          <use href="#key" />
          <path
            className={styles.lettering}
            d="
              M 40,37
              L 40,63
              M 40,37
              L 60,63
              M 60,63
              L 60,37                 
            "
          />
        </g>
        <g id="rKey">
          <use href="#key" />
          <path
            className={styles.lettering}
            d="
              M 42,37
              L 42,63
              M 42,37
              L 50,37
              A 7 6 0 0 1 50,50
              L 42,50
              M 42,50
              L 58,63
            "
          />
        </g>
        <g id="oKey">
          <use href="#key" />
          <ellipse className={styles.lettering} cx="50" cy="50" rx="12" ry="13" />
        </g>
        <g id="tKey">
          <use href="#key" />
          <path
            className={styles.lettering}
            d="
              M 42,37
              L 58,37
              M 50,37
              L 50,63               
            "
          />
        </g>
      </defs>
      <use href="#bKey" x="0" />
      <use href="#eKey" x="110" />
      <use href="#nKey" x="220" />
      <use href="#bKey" x="25" y="110" />
      <use href="#rKey" x="135" y="110" />
      <use href="#oKey" x="245" y="110" />
      <use href="#tKey" x="355" y="110" />
      <use href="#tKey" x="465" y="110" />
    </svg>
  );
};

export default LogoNameDark;
