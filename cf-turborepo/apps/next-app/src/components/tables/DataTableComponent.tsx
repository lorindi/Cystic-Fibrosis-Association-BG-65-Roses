'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash2,
  Plus,
  AlertTriangle
} from "lucide-react";

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
  tableClass = "",
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
  const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

  const toggleRow = (rowData: any) => {
    const id = rowData.id;
    const newExpandedRows = { ...expandedRows };
    
    if (expandedRows[id]) {
      delete newExpandedRows[id];
      console.log("Row collapsed:", id);
    } else {
      newExpandedRows[id] = true;
      console.log("Row expanded:", id);
    }
    
    setExpandedRows(newExpandedRows);
    onRowToggle?.(rowData, Object.keys(newExpandedRows).map(key => ({ id: key })));
  };

  // CRUD operations
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);

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
  const handleRowSelect = (rowData: any) => {
    setSelectedRow(rowData);
    console.log("Row selected:", rowData);
    onRowSelect?.(rowData);
  };

  // Expansion template
  const renderExpansionContent = (data: any) => {
    if (expansionSlot) {
      return expansionSlot(data);
    }
    
    return (
      <div className="p-3 bg-muted text-muted-foreground">
        <h5 className="text-sm font-medium">Details for {data.name || data.title}</h5>
        <p className="mt-2">Additional information here...</p>
        <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  // Actions template
  const renderActions = (rowData: any) => {
    if (actionsSlot) {
      return actionsSlot(rowData);
    }
    
    return (
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => editItem(rowData)}
          className="h-8 w-8"
        >
          <Pencil size={16} />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => confirmDelete(rowData)}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Create button outside the table */}
      {(createButtonSlot || onCreate) && (
        <div className="flex justify-end mb-2">
          {createButtonSlot || (
            <Button 
              onClick={createNew}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Create new
            </Button>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        loadingSlot || (
          <div className="p-4 text-center bg-muted rounded-lg">
            Loading data...
          </div>
        )
      ) : data.length === 0 ? (
        emptySlot || (
          <div className="p-4 text-center bg-muted rounded-lg">
            No records found
          </div>
        )
      ) : (
        <div className={`rounded-md border ${tableClass}`}>
          <Table>
            <TableHeader>
              <TableRow>
                {expandable && (
                  <TableHead className="w-[40px]"></TableHead>
                )}
                {columns.map((col, index) => (
                  <TableHead key={index} style={col.headerStyle}>
                    {col.header}
                  </TableHead>
                ))}
                {actions && (
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                )}
                {statusSlot && (
                  <TableHead>Status</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <>
                  <TableRow 
                    key={`row-${rowIndex}`}
                    className={`${rowClass?.(row) || ''} ${selectable && selectedRow?.id === row.id ? 'bg-muted' : ''}`}
                    onClick={selectable ? () => handleRowSelect(row) : undefined}
                    style={{ cursor: selectable ? 'pointer' : 'default' }}
                  >
                    {expandable && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRow(row);
                          }}
                        >
                          {expandedRows[row.id] ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </Button>
                      </TableCell>
                    )}
                    
                    {columns.map((col, colIndex) => (
                      <TableCell key={`cell-${rowIndex}-${colIndex}`} style={col.style}>
                        {col.template 
                          ? col.template(row) 
                          : columnTemplates?.[col.field] 
                            ? columnTemplates[col.field](row, col)
                            : row[col.field]}
                      </TableCell>
                    ))}
                    
                    {actions && (
                      <TableCell className="text-right">
                        {renderActions(row)}
                      </TableCell>
                    )}
                    
                    {statusSlot && (
                      <TableCell>
                        {statusSlot(row, handleStatusChange)}
                      </TableCell>
                    )}
                  </TableRow>
                  
                  {expandable && expandedRows[row.id] && (
                    <TableRow key={`exp-${rowIndex}`}>
                      <TableCell colSpan={columns.length + (actions ? 1 : 0) + (statusSlot ? 1 : 0) + 1}>
                        {renderExpansionContent(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete this record from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle size={24} />
            <span>Are you sure you want to delete this record?</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteItem}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 