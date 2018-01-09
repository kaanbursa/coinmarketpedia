import React from 'react';
import { jsonServerRestClient, Admin, Resource, Delete } from 'admin-on-rest';

const AdminView = (props) => {
  const { formulas } = props;
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

    </div>
  );


};

export default AdminView;
