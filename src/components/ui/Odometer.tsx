import React from 'react';

const LH = 1.08;

const Digit: React.FC<{ d: number }> = ({ d }) => (
  <span
    className="relative inline-block overflow-hidden align-bottom"
    style={{
      height: `${LH}em`,
      width: '0.62em',
      WebkitMaskImage: 'linear-gradient(transparent, #000 22%, #000 78%, transparent)',
      maskImage: 'linear-gradient(transparent, #000 22%, #000 78%, transparent)',
    }}
  >
    <span
      className="flex flex-col"
      style={{ transform: `translateY(-${d * LH}em)`, transition: 'transform 0.75s cubic-bezier(0.2, 0.9, 0.25, 1.12)' }}
    >
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <span key={n} className="block text-center" style={{ height: `${LH}em`, lineHeight: `${LH}em` }}>
          {n}
        </span>
      ))}
    </span>
  </span>
);

/** Rolling-digit counter. Accepts a number or a pre-formatted string ("R$ 84.000"). */
export const Odometer: React.FC<{ value: number | string; className?: string }> = ({ value, className = '' }) => {
  const chars = String(value).split('');
  return (
    <span className={`inline-flex ${className}`} aria-label={String(value)} role="text">
      {chars.map((ch, i) => {
        const key = chars.length - i;
        return /\d/.test(ch) ? (
          <Digit key={key} d={Number(ch)} />
        ) : (
          <span key={key} className="inline-block whitespace-pre" style={{ height: `${LH}em`, lineHeight: `${LH}em` }}>
            {ch}
          </span>
        );
      })}
    </span>
  );
};
