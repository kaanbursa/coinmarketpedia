import React from 'react';

const Table = (props) => {
  const { table, rows, columns, author, formula } = props;
  return (
    <div className="table-responsive">
      <h1> LME </h1>
      <table className="table table-striped bigTable">
        <thead>
          <tr>{columns.map((c) => <th key={c.key}>{c.name}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r,i) => <tr key={i}>
            {columns.map(c => <td key={c.key}>{ r[c.key] }</td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
