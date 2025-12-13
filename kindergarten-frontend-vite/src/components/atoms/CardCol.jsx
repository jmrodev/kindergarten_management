import React from 'react';

export default function CardCol({ number, icon: Icon, text, variant = '', extraClass = '', onClick }) {
  const classes = `stat-card ${variant} ${extraClass}`.trim();
  return (
    <div className="card-col">
      <div className={classes} onClick={onClick}>
        <div className="card-content">
          <div className="number">{number}</div>
          <div className="label">
            {Icon ? <Icon className="icon-middle" /> : null}
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
