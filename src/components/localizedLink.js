import React from 'react';
import Link from '../utils/link';
import { LocaleContext } from './layout';
import locales from '../../config/i18n';

const LocalizedLink = ({ to, ...props }) => {
  const { localeInfo } = React.useContext(LocaleContext);

  const isIndex = to === `/`;
  const path = locales[localeInfo.locale].default
    ? to
    : `/${locales[localeInfo.locale].path}${isIndex ? `` : `${to}`}`;
  if (path) {
    return <Link {...props} to={path.replace('//', '/')} />;
  } else {
    return <></>;
  }
};

export default LocalizedLink;
