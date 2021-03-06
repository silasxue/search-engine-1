import { render } from 'react-dom';
import axios from 'axios';

import App from './containers/App.jsx';
import fetchMap from './actions/fetchMap';
import store from './store/store';
import './sass/main.sass';

// Use Analytics if on production.
window.googleTrackingID = process.env.NODE_ENV === 'production' ? 'UA-74470910-2' : '';

// Enable hot reloading
if (module.hot) {
  module.hot.accept();
}

window.addEventListener('load', () => {
  render(<App store={store} />, document.getElementById('react-app'));

  // Catch clicks on links, add GA calls, and change default behavior.
  // If link is internal, fetch new map; if link is external, open in new tab.
  document.body.addEventListener('click', (e) => {
    e.preventDefault();
    let t = e.target;

    if (t.tagName === 'IMG' && t.parentElement.tagName === 'A') {
      t = t.parentElement;
    }

    // Internal link clicked.
    if (t.tagName === 'A' && t.href.indexOf(window.location.origin) !== -1) {
      const url = t.href.replace(window.location.origin, '');

      ga('send', 'event', {
        eventCategory: 'Navigation',
        eventAction: 'internal link clicked',
        eventLabel: url.slice(1),
      });

      store.dispatch(fetchMap(url));
      ga('send', 'pageview', url);

    // External link clicked.
    } else if (t.tagName === 'A') {
      const windowRef = window.open();

      ga('send', 'event', {
        eventCategory: 'Navigation',
        eventAction: 'external link clicked',
        eventLabel: t.href,
      });

      windowRef.location = t.href;
      windowRef.focus();
    }
  });
});

window.addEventListener('popstate', () => (
  store.dispatch(fetchMap(window.location.pathname, false))
));
