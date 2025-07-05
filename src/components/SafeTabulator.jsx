import React, { forwardRef } from 'react';
import { ReactTabulator as Tabulator } from 'react-tabulator';

const SafeTabulator = forwardRef((props, ref) => (
  <div ref={ref}>
    <Tabulator {...props} />
  </div>
));

SafeTabulator.displayName = 'SafeTabulator';

export default SafeTabulator;
