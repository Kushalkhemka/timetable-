"use client";
import { useState } from 'react';
import { Pagination } from 'flowbite-react';

const TableDataCode = () => {
  const [tablePage, setTablePage] = useState(1);

  const onTableChange = (page: number) => setTablePage(page);

  return (
    <div>
      <Pagination
        currentPage={tablePage}
        totalPages={100}
        onPageChange={onTableChange}
        showIcons
      />
    </div>
  );
};

export default TableDataCode;
