import React from 'react';
import LocalizedLink from '../localizedLink';

const isHash = (str) => /^#/.test(str);
const isInternal = (to) => /^\/(?!\/)/.test(to);

const MdxLink = ({ href, children, ...props }) =>
  isHash(href) || !isInternal(href) ? (
    <a {...props} href={href}>
      {children}
    </a>
  ) : (
    <LocalizedLink {...props} to={href} />
  );

export default MdxLink;
