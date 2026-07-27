import { Plane } from '@/components/icons';

export interface PassField {
  label: string;
  value: string;
  mono?: boolean;
  big?: boolean;
}

interface Props {
  from: string;
  to: string;
  fromCity?: string;
  toCity?: string;
  fields?: PassField[];
  stubFields?: PassField[];
  code?: string;
  stamp?: string;
  dark?: boolean;
  className?: string;
  /** colour of the surface behind the pass, so the punched notches read as holes */
  notch?: string;
  title?: string;
}

const value = (f: PassField) =>
  `pass__value${f.mono ? ' pass__value--mono' : ''}${f.big ? ' pass__value--big' : ''}`;

export default function BoardingPass({
  from, to, fromCity, toCity,
  fields = [], stubFields = [], code, stamp,
  dark, className = '', notch, title = 'Boarding Pass'
}: Props) {
  return (
    <article
      className={`pass${dark ? ' pass--dark' : ''} ${className}`}
      style={notch ? ({ ['--bg-notch' as string]: notch } as React.CSSProperties) : undefined}
    >
      <div className="pass__main">
        <div className="pass__row" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span className="pass__label">{title}</span>
          <span className="pass__label">Flying Colours Vacations</span>
        </div>

        <div className="pass__route">
          <div>
            <span className="pass__iata">{from}</span>
            {fromCity && <span className="pass__label" style={{ marginTop: '.2rem' }}>{fromCity}</span>}
          </div>

          <span className="pass__path" aria-hidden="true">
            <i className="pass__path-line" />
            <Plane className="pass__path-plane" />
          </span>

          <div style={{ textAlign: 'right' }}>
            <span className="pass__iata">{to}</span>
            {toCity && <span className="pass__label" style={{ marginTop: '.2rem' }}>{toCity}</span>}
          </div>
        </div>

        {fields.length > 0 && (
          <div className="pass__row">
            {fields.map((f) => (
              <div className="pass__field" key={f.label}>
                <span className="pass__label">{f.label}</span>
                <span className={value(f)}>{f.value}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'clamp(1rem, 2.4vw, 1.6rem)' }}>
          <div className="barcode" aria-hidden="true" />
          {code && <div className="pass__code">{code}</div>}
        </div>

        {stamp && <div className="stamp" aria-hidden="true">{stamp}</div>}
      </div>

      <div className="pass__stub">
        {stubFields.map((f) => (
          <div className="pass__field" key={f.label}>
            <span className="pass__label">{f.label}</span>
            <span className={value(f)}>{f.value}</span>
          </div>
        ))}
        <div className="barcode--v" aria-hidden="true" />
      </div>
    </article>
  );
}
