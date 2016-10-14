import styles from './main.css';

module.exports = () => {
  const element = document.createElement('h1');
  element.className = 'pure-button';
  element.innerHTML = 'Hello world';
  // element.className = styles.pinkbg;

  return element;
};
