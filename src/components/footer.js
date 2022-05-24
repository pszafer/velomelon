import React from 'react';
import Link from '../utils/link';
import LocalizedLink from './localizedLink';
import { FaFacebook, FaYoutube, FaEnvelope } from 'react-icons/fa';

const Footer = ({ currentPage, numPages }) => {
  return (
    <div className="bottom-nav outer">
      <div className="inner">
        <div className="bottom-inner-nav">
          <div className="bottom-center">
            <Pagination currentPage={currentPage} numPages={numPages} />
            <div className="bottom-site-nav">
              <div className="bottom-nav-right">
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
                    >
                      <FaFacebook />
                    </Link>
                  </li>
                  <li>
                    <a
                      className="fa-icon email"
                      target="_top"
                      href="mailto:velomelon@velomelon.com"
                    >
                      <FaEnvelope />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getNextPageNumber(pageNo, increment) {
  return increment
    ? pageNo === 0
      ? ''
      : pageNo + 1
    : pageNo > 2
    ? pageNo - 1
    : '';
}

function getClassForMobile(i, currentPage) {
  return i + 2 !== currentPage && i !== currentPage ? 'hidden-xs' : '';
}

const Pagination = ({ currentPage, numPages }) => {
  return (
    <div className="pagination">
      <LocalizedLink
        className={currentPage === 1 ? 'disabled' : ''}
        to={'/' + getNextPageNumber(currentPage, false)}
        rel="prev"
      >
        &laquo;
      </LocalizedLink>
      {Array.from({ length: numPages }).map((_, i) => (
        <LocalizedLink
          key={i + 'pagingLink'}
          className={
            i + 1 === currentPage
              ? 'active disabled'
              : getClassForMobile(i, currentPage)
          }
          to={'/' + (i > 0 ? i + 1 : '')}
        >
          {i + 1}
        </LocalizedLink>
      ))}
      <LocalizedLink
        className={currentPage === numPages ? 'disabled' : ''}
        to={'/' + getNextPageNumber(currentPage, true)}
        rel="next"
      >
        &raquo;
      </LocalizedLink>
    </div>
  );
};

export default Footer;
