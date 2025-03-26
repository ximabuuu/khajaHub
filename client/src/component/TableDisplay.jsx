import React from 'react'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
  } from '@tanstack/react-table'

const TableDisplay = ({data,column}) => {
    const table = useReactTable({
        data,
        columns : column,
        getCoreRowModel: getCoreRowModel(),
      })
  return (
    <div className="p-2">
    <table className='w-full py-0 px-0 border-collapse'>
      <thead className='bg-blue-100'>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            <th className='border border-blue-200'>Sr.No</th>
            {headerGroup.headers.map(header => (
              <th key={header.id} className='border border-blue-200 py-1'>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row,index) => (
          <tr key={row.id}>
            <td className='border border-blue-200 px-2 py-1 items-center justify-center'>{index+1}</td>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id} className='border border-blue-200 px-2 py-1'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    <div className="h-4" />
  </div>
  )
}

export default TableDisplay
