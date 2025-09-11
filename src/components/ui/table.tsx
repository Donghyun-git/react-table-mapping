import * as React from 'react';

function Table(props: React.ComponentProps<'table'>) {
  return (
    <div className="mapping-table-container">
      <table className="mapping-table" {...props} />
    </div>
  );
}

function TableHeader(props: React.ComponentProps<'thead'>) {
  return <thead className="mapping-table-header" {...props} />;
}

function TableBody(props: React.ComponentProps<'tbody'>) {
  return <tbody className="mapping-table-body" {...props} />;
}

function TableFooter(props: React.ComponentProps<'tfoot'>) {
  return <tfoot className="mapping-table-footer" {...props} />;
}

function TableRow(props: React.ComponentProps<'tr'>) {
  return <tr className="mapping-table-row" {...props} />;
}

function TableHead(props: React.ComponentProps<'th'>) {
  return <th className="mapping-table-head" {...props} />;
}

function TableCell(props: React.ComponentProps<'td'>) {
  return <td className="mapping-table-cell" {...props} />;
}

function TableCaption(props: React.ComponentProps<'caption'>) {
  return <caption className="mapping-table-caption" {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
