import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Table } from 'components';


const TableList = ({ tables }) => (
  <div>
    <div className="row">
      {
          tables.map((table, i) => <Table key={i} {...table} />)
        }
    </div>
  </div>
);


export default TableList;
