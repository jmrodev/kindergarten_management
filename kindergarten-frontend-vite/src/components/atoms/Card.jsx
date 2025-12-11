import React from 'react';

const Card = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const cardClass = `custom-card ${className}`.trim();

  return (
    <div
      className={cardClass}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const headerClass = `custom-card-header ${className}`.trim();

  return (
    <div
      className={headerClass}
      {...props}
    >
      {children}
    </div>
  );
};

const CardBody = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const bodyClass = `custom-card-body ${className}`.trim();

  return (
    <div
      className={bodyClass}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({
  children,
  className = '',
  style = {},
  ...props
}) => {
  const footerClass = `custom-card-footer ${className}`.trim();

  return (
    <div
      className={footerClass}
      {...props}
    >
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;