import React, { useContext } from 'react';
import Link from '../utils/link';
import LocalizedLink from './localizedLink';
import { useStaticQuery, graphql } from 'gatsby';
import { LocaleContext } from './layout';
import useTranslations from './useTranslations';
import { Flag } from './flag';
import { IoIosHome, IoMdGlobe, IoMdGrid } from 'react-icons/io';
import { FaFacebook, FaYoutube } from 'react-icons/fa';
import Logo from './logo';
import { Icon, Heading, Flex } from '@chakra-ui/react';
import { BackgroundHeader } from './backgroundimg';
const Header = ({ title, description }) => {
  const { localeInfo } = useContext(LocaleContext);
  const data = useStaticQuery(
    graphql`
      query {
        logo: file(absolutePath: { regex: "/logo.svg/" }) {
          publicURL
        }
        background: file(relativePath: { eq: "background.jpg" }) {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
              placeholder: BLURRED
              formats: [AUTO, AVIF, WEBP]
            )
          }
        }
        logo600: file(relativePath: { eq: "logo600.png" }) {
          childImageSharp {
            gatsbyImageData
          }
        }
        plFlag: file(relativePath: { eq: "pl.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30, height: 25, layout: FIXED)
          }
        }
        enFlag: file(relativePath: { eq: "us.png" }) {
          childImageSharp {
            gatsbyImageData(width: 30, height: 25, layout: FIXED)
          }
        }
      }
    `
  );
  if (localeInfo.isHome) {
    return (
      <BackgroundHeader
        className="site-header outer responsive-header-img"
        background={data.background}
      >
        <div className="inner">
          <div className="site-header-content">
            <Flex as="h1" className="site-title">
              <span className="site-title-text">{title}</span>
              <Logo
                className="site-logo"
                alt={title}
                logoType="svg"
                logo={data.logo.publicURL}
              />
            </Flex>
            <Heading as="h2" className="site-description">
              {description}
            </Heading>
          </div>
          <Nav isHome={true} title={title} headerData={data} />
        </div>
      </BackgroundHeader>
    );
  }
  return (
    <header className="site-header outer">
      <div className="inner">
        <div className="site-header-content"></div>
        <Nav isHome={false} title={title} headerData={data} />
      </div>
    </header>
  );
};

function Nav({ isHome, title, headerData }) {
  const { home, polish, english, map, map_description, tags } =
    useTranslations();
  const {
    localeInfo: { slug, locale: lang },
  } = React.useContext(LocaleContext);
  const menuData = [
    { to: '/', alt: home, text: home, icon: IoIosHome },
    { to: 'america-map', alt: map_description, text: map, icon: IoMdGlobe },
    { to: 'tags', alt: tags, text: tags, icon: IoMdGrid },
  ];
  return (
    <nav className="site-nav">
      <div className="site-nav-left">
        <LocalizedLink to="/" aria-label={home}>
          {!isHome && (
            <Logo
              className="site-nav-logo"
              alt={title}
              logoType="fluid"
              logo={headerData.logo600.childImageSharp.gatsbyImageData}
            />
          )}
        </LocalizedLink>
        <ul className="nav">
          {menuData.map((item, index) => (
            <li
              key={item.to + index}
              className={'nav-item ' + isCurrent(item.to, slug)}
            >
              <LocalizedLink
                to={'/' + item.to}
                aria-label={item.alt}
                alt={item.alt}
              >
                <Icon as={item.icon} /> {item.text}
              </LocalizedLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="site-nav-right">
        <ul className="nav lang">
          <li>
            <Link
              className="fa-icon youtube"
              to="https://youtube.com/velomelon"
            >
              <FaYoutube />
            </Link>
          </li>
          <li>
            <Link
              className="fa-icon facebook"
              to="https://facebook.com/velomelon"
              hrefLang={lang}
            >
              <FaFacebook />
            </Link>
          </li>
          <li>
            <Flag
              country="en"
              text={english}
              lang={lang}
              flag={headerData.enFlag.childImageSharp.gatsbyImageData}
              to={`/${slug}`}
            />
          </li>
          <li>
            <Flag
              country="pl"
              text={polish}
              lang={lang}
              flag={headerData.plFlag.childImageSharp.gatsbyImageData}
              to={`/pl/${slug}`}
            />
          </li>
        </ul>
      </div>
    </nav>
  );
}

function isCurrent(to, current) {
  current = current.replace(/\//g, '');
  to = to.replace(/\//g, '');
  return to === current ? 'nav-current' : '';
}

export { Header };
