import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import throttle from 'lodash.throttle';
import styles from './About.module.scss';
import logoNameLight from 'assets/logoNameLight.svg';
import logoNameDark from 'assets/logoNameDark.svg';
import logoNameFlatLight from 'assets/logoNameFlatLight.svg';
import logoNameFlatDark from 'assets/logoNameFlatDark.svg';

const TEXT_MAPS = [
  { label: 'WHO', info: 'Ben Brott, software engineer at Appian' },
  { label: 'WHAT', info: 'A site inspired by talks at An Event Apart DC' },
  { label: 'WHY', info: 'To learn CSS, explore SVG, and design eye-catching, responsive UIs' },
  { label: 'HOW', info: 'React, Sass, GitHub Pages' }
];

class About extends React.PureComponent {
  static propTypes = { isDark: PropTypes.bool }
  static defaultProps = { isDark: false }

  constructor(props) {
    super(props);
    this.state = { isNarrow: this.isNarrowScreen() };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize); 
  }

  isNarrowScreen = () => window.matchMedia('(max-width: 66em)').matches

  handleResize = throttle(() => {
    const isNarrow = this.isNarrowScreen();
    this.setState({ isNarrow });
  }, 100)

  getBannerSrc = () => {
    const isDark = this.props.isDark;
    if (this.state.isNarrow) {
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
        <span className={labelStyles}>{label}</span>,
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

  render() {
    return (
      <div className={styles.container}>
        <img src={this.getBannerSrc()} className={styles.banner} alt="" />
        {this.renderTextGrid()}
      </div>
    );
  }
}

export default About;