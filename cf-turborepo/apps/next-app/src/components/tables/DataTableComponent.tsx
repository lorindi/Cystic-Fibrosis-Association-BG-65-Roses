'use client';

import { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

interface ColumnDefinition {
  field: string;
  header: string;
  sortable?: boolean;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  template?: (rowData: any) => React.ReactNode;
}

interface DataTableComponentProps {
  // Table data
  data: any[];
  // Column definitions
  columns: ColumnDefinition[];
  // Enable row expansion
  expandable?: boolean;
  // Enable actions column
  actions?: boolean;
  // Enable row selection
  selectable?: boolean;
  // Table style
  tableClass?: string;
  // Loading state
  loading?: boolean;
  // Custom row class
  rowClass?: (data: any) => string;
  // Selection
  selection?: any;
  // Events
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onCreate?: () => void;
  onRowToggle?: (rowData: any, expandedRows: any[]) => void;
  onStatusChange?: (item: any, newStatus: any) => void;
  onRowSelect?: (rowData: any) => void;
  // Render props/slots
  createButtonSlot?: React.ReactNode;
  actionsSlot?: (rowData: any) => React.ReactNode;
  statusSlot?: (rowData: any, onChange: (item: any, newStatus: any) => void) => React.ReactNode;
  expansionSlot?: (rowData: any) => React.ReactNode;
  emptySlot?: React.ReactNode;
  loadingSlot?: React.ReactNode;
  // Pass column templates as an object with key = field name
  columnTemplates?: {
    [field: string]: (rowData: any, column: ColumnDefinition) => React.ReactNode;
  };
}

export default function DataTableComponent({
  data,
  columns,
  expandable = false,
  actions = true,
  selectable = false,
  tableClass = "bg-gray-700",
  loading = false,
  rowClass,
  selection,
  onEdit,
  onDelete,
  onCreate,
  onRowToggle,
  onStatusChange,
  onRowSelect,
  createButtonSlot,
  actionsSlot,
  statusSlot,
  expansionSlot,
  emptySlot,
  loadingSlot,
  columnTemplates,
  ...otherProps
}: DataTableComponentProps) {
  // Row expansion logic
  const [expandedRows, setExpandedRows] = useState<any[]>([]);

  const toggleRow = (rowData: any) => {
    const index = expandedRows.findIndex(d => d.id === rowData.id);
    let newExpandedRows;
    
    if (index >= 0) {
      newExpandedRows = [...expandedRows];
      newExpandedRows.splice(index, 1);
      console.log("Row collapsed:", rowData.id);
    } else {
      newExpandedRows = [...expandedRows, rowData];
      console.log("Row expanded:", rowData.id);
    }
    
    setExpandedRows(newExpandedRows);
    onRowToggle?.(rowData, newExpandedRows);
  };

  const isExpanded = (rowData: any) => {
    return expandedRows.some(d => d.id === rowData.id);
  };

  // CRUD operations
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  const createNew = () => {
    console.log("Creating new item");
    onCreate?.();
  };

  const editItem = (item: any) => {
    console.log("Editing item:", item);
    onEdit?.(item);
  };

  const confirmDelete = (item: any) => {
    setItemToDelete(item);
    setDeleteDialog(true);
    console.log("Confirming delete for item:", item);
  };

  const deleteItem = () => {
    if (itemToDelete) {
      console.log("Item deleted:", itemToDelete);
      onDelete?.(itemToDelete);
      
      // Close the dialog
      setDeleteDialog(false);
      setItemToDelete(null);
    }
  };

  // Handle status change
  const handleStatusChange = (item: any, newStatus: any) => {
    console.log("Status changed for item:", item, "New status:", newStatus);
    onStatusChange?.(item, newStatus);
  };

  // Handle row selection
  const handleRowSelect = (event: any) => {
    console.log("Row selected:", event.data);
    onRowSelect?.(event.data);
  };

  // Expansion template
  const expansionTemplate = (data: any) => {
    if (expansionSlot) {
      return expansionSlot(data);
    }
    
    return (
      <div className="p-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        <h5>Details for {data.name || data.title}</h5>
        <p>Additional information here...</p>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };

  // Empty template
  const emptyTemplate = () => {
    if (emptySlot) {
      return emptySlot;
    }
    
    return (
      <div className="p-4 text-center bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        No records found
      </div>
    );
  };

  // Loading template
  const loadingTemplate = () => {
    if (loadingSlot) {
      return loadingSlot;
    }
    
    return (
      <div className="p-4 text-center bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
        Loading data...
      </div>
    );
  };

  // Actions template
  const actionsBodyTemplate = (rowData: any) => {
    if (actionsSlot) {
      return actionsSlot(rowData);
    }
    
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-pencil" 
          onClick={() => editItem(rowData)} 
          className="p-button-success p-button-sm" 
          tooltip="Edit"
        />
        <Button 
          icon="pi pi-trash" 
          onClick={() => confirmDelete(rowData)} 
          className="p-button-danger p-button-sm" 
          tooltip="Delete"
        />
      </div>
    );
  };

  // Status template
  const statusBodyTemplate = (rowData: any) => {
    if (statusSlot) {
      return statusSlot(rowData, handleStatusChange);
    }
    return null;
  };

  // Expander template
  const expanderBodyTemplate = (rowData: any) => (
    <button 
      onClick={() => toggleRow(rowData)}
      className="p-link"
    >
      <i className={`pi ${!isExpanded(rowData) ? 'pi-chevron-down' : 'pi-chevron-up'}`}></i>
    </button>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Create button outside the table */}
      {(createButtonSlot || onCreate) && (
        <div className="flex justify-end">
          {createButtonSlot || (
            <Button 
              icon="pi pi-plus" 
              label="Create new" 
              onClick={createNew} 
              className="p-button-success"
            />
          )}
        </div>
      )}

      <DataTable 
        value={data} 
        expandedRows={expandedRows}
        onRowToggle={(e: { data: any[] }) => setExpandedRows(Array.isArray(e.data) ? e.data : [])}
        rowExpansionTemplate={expansionTemplate}
        rowClassName={rowClass}
        selection={selectable ? selection : undefined}
        selectionMode={selectable ? 'single' : undefined}
        onSelectionChange={(e: { value: any }) => handleRowSelect(e)}
        className={tableClass}
        loading={loading}
        emptyMessage={emptyTemplate}
        loadingIcon={loadingTemplate}
        {...otherProps}
      >
        {/* Toggle column for expandable rows */}
        {expandable && (
          <Column 
            expander 
            headerStyle={{ width: '3rem' }} 
            className={tableClass}
            body={expanderBodyTemplate}
          />
        )}

        {/* Dynamic columns */}
        {columns.map((col, index) => (
          <Column 
            key={index}
            field={col.field} 
            header={col.header}
            sortable={col.sortable !== false}
            className={tableClass}
            style={col.style}
            headerStyle={col.headerStyle}
            body={col.template || (columnTemplates?.[col.field] ? 
              (rowData) => columnTemplates[col.field](rowData, col) : 
              undefined)}
          />
        ))}

        {/* Actions column */}
        {actions && (
          <Column 
            header="Actions" 
            className={tableClass}
            body={actionsBodyTemplate}
          />
        )}

        {/* Status column */}
        {statusSlot && (
          <Column 
            header="Status" 
            className={tableClass}
            body={statusBodyTemplate}
          />
        )}
      </DataTable>

      {/* Delete confirmation dialog */}
      <Dialog 
        visible={deleteDialog} 
        style={{ width: '450px' }} 
        header="Confirmation" 
        modal
        onHide={() => setDeleteDialog(false)}
        footer={(
          <>
            <Button 
              label="No" 
              icon="pi pi-times" 
              onClick={() => setDeleteDialog(false)} 
              className="p-button-text" 
            />
            <Button 
              label="Yes" 
              icon="pi pi-check" 
              onClick={deleteItem} 
              className="p-button-danger" 
            />
          </>
        )}
      >
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          <span>Are you sure you want to delete this record?</span>
        </div>
      </Dialog>
    </div>
  );
} 