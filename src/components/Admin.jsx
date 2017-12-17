import React from 'react';
const ReactDataGrid = require('react-data-grid');
import { jsonServerRestClient, Admin, Resource, Delete } from 'admin-on-rest';

const AdminView = (props) => {
  const { formulas } = props;
  console.log(formulas);
  const columns = [
    {
      key: 'id',
      name: 'ID',
    },
    {
      key: 'name',
      name: 'Material Name',
    },
    {
      key: 'formula',
      name: 'Formula',
    },
  ];
  const rows = [{
    id: 1,
    name: 'CU',
    formula: '+10'},
  ];
  const rowGetter = rowNumber => rows[rowNumber];
  return (
    <div>
      <h1>Hello Admin</h1>
      <div className="col-md-6">
        <h3>Recommended Price Formula List</h3>
        <ReactDataGrid
        enableCellSelect
        columns={columns}
        rowGetter={rowGetter}
        rowsCount={rows.length}
        minHeight={250}
        />
      </div>
      <div className="col-md-6">
        <h3>Past Changes</h3>
        <ReactDataGrid
        enableCellSelect
        columns={columns}
        rowGetter={rowGetter}
        rowsCount={rows.length}
        minHeight={250}
        />
      </div>
    </div>
  );


};

export default AdminView;
