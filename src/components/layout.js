import React from 'react';
import Seo from './seo';
import { isHome } from '../utils/shared';
import Redirect from './redirect';

const LocaleContext = React.createContext();

const Layout = (props) => {
  const { children, pageContext } = props;
  const home = isHome(pageContext.slug);
  const classes = home ? 'home-template' : 'post-template';
  const localeInfo = {
    locale: pageContext.locale,
    slug: pageContext.slug,
    isHome: home,
    dateFormat: pageContext.dateFormat,
    siteTitle: pageContext.title,
  };
  let keywords = pageContext.tags ? pageContext.tags : [];
  keywords = [
    `blog`,
    `velomelon`,
    `travel`,
    `bicycle`,
    pageContext.title,
    ...keywords,
  ];
  return (
    <LocaleContext.Provider value={{ localeInfo }}>
      <Seo
        title={pageContext.title}
        description={pageContext.description}
        lang={pageContext.locale}
        keywords={keywords}
      />
      <Redirect localeInfo={localeInfo}>
        <div id="mainDiv" className={classes}>
          {children}
        </div>
      </Redirect>
    </LocaleContext.Provider>
  );
};

export { Layout, LocaleContext };
