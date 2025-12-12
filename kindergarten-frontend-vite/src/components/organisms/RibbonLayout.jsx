import React from 'react';
import OfficeRibbon from './OfficeRibbon.jsx';

const RibbonLayout = ({ children }) => (
  <>
    <OfficeRibbon />
    <div className="main-content-with-ribbon">{children}</div>
  </>
);

export default RibbonLayout;
