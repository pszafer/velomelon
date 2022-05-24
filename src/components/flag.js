import React from 'react';
import { Img } from './img';
import Link from '../utils/link';

function clickFlagLink(lang) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('language', lang);
  }
}

export const Flag = ({ country, text, lang, to, flag }) => {
  const className = country === lang ? 'active-lang' : '';
  return (
    <Link
      className={className}
      to={to.replace('//', '/')}
      hrefLang={country}
      onClick={() => {
        clickFlagLink(country);
      }}
    >
      <Img image={flag} alt={text} />
    </Link>
  );
};
