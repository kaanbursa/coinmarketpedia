import React from 'react';
import { Link } from 'react-router';
import { Table } from 'components';
import PropTypes from 'prop-types';


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
