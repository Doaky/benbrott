import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './About.module.scss';
import withFormFactor from 'utils/withFormFactor';
import logoNameLight from 'svg/logoNameLight.svg';
import logoNameDark from 'svg/logoNameDark.svg';
import logoNameFlatLight from 'svg/logoNameFlatLight.svg';
import logoNameFlatDark from 'svg/logoNameFlatDark.svg';
import GitHub from 'svgComponents/GitHub';
import LinkedIn from 'svgComponents/LinkedIn';
import Twitter from 'svgComponents/Twitter';

const TEXT_MAPS = [
  { label: 'WHO', info: 'Ben Brott, software engineer at Appian' },
  { label: 'WHAT', info: 'A site inspired by talks at An Event Apart DC' },
  { label: 'WHY', info: 'To learn CSS, explore SVG, and design eye-catching, responsive UIs' },
  { label: 'HOW', info: 'React, Sass, GitHub Pages' }
];

const SOCIAL_LINKS = [
  { Component: Twitter, href: 'https://twitter.com/BenBrott' },
  { Component: GitHub, href: 'https://github.com/BenBrott' },
  { Component: LinkedIn, href: 'https://www.linkedin.com/in/brott/' }
];

class About extends React.PureComponent {
  static propTypes = { isDark: PropTypes.bool }
  static defaultProps = { isDark: false }

  getBannerSrc = () => {
    const { isDark, isMobile } = this.props;
    if (isMobile) {
      return isDark ? logoNameLight : logoNameDark;
    }
    return isDark ? logoNameFlatLight : logoNameFlatDark;
  }

  renderTextItems = () => {
    const themeStyle = this.props.isDark ? styles.dark : styles.light;
    return TEXT_MAPS.map(({label, info}, index) => {
      const labelStyles = classNames([
        styles.label,
        styles[`label${index}`],
        themeStyle
      ]);
      const infoStyles = classNames([
        styles.info,
        styles[`info${index}`],
        themeStyle
      ]);
      return ([
        <h4 className={labelStyles}>{label}</h4>,
        <span className={infoStyles}>{info}</span>
      ]);
    });
  }

  renderTextGrid = () => {
    return (
      <div className={styles.grid}>
        {this.renderTextItems()}
      </div>
    );
  }

  renderLinkItems = () => {
    return SOCIAL_LINKS.map(({Component, href}) => {
      return (
        <a className={styles.socialLink} href={href} target="_blank" rel="noopener noreferrer">
          <Component />
        </a>
      )
    });
  }

  renderSocialLinks = () => {
    return(
      <div className={styles.socialLinksContainer}>
        {this.renderLinkItems()}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        <div>
          <img src={this.getBannerSrc()} className={styles.banner} alt="" />
          {this.renderTextGrid()}
        </div>
        {this.renderSocialLinks()}
      </div>
    );
  }
}

export default withFormFactor(About);