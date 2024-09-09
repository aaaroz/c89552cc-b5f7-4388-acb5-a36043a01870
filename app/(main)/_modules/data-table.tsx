"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EmployeeSchema, TEmployeeSchema } from "./columns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ApiPost, ApiPut } from "@/lib/api";
import { Plus, SaveAll, Undo2 } from "lucide-react";
import { NewColumns } from "./new-columns";
import { toast } from "sonner";
import useCommonContext from "@/lib/hooks/common";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  oldData: TData[];
  setData: React.Dispatch<React.SetStateAction<TData[]>>;
}

const newPayloadExample: TEmployeeSchema = {
  id: 0,
  first_name: "",
  last_name: "",
  position: "",
  phone_number: "",
  email: "",
};
export const validateEmail = (email: string, columnId: string) => {
  if (columnId !== "email") return { success: true };
  const isValidEmail = EmployeeSchema.shape.email.safeParse(email);
  return isValidEmail;
};
export const validatePhone = (phone: string, columnId: string) => {
  if (columnId !== "phone_number") return { success: true };
  const isValidPhone = EmployeeSchema.shape.phone_number.safeParse(phone);
  return isValidPhone;
};

export const DataTable = <TData, TValue>({
  columns,
  data,
  oldData,
  setData,
}: DataTableProps<TData, TValue>): React.ReactElement => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [payload, setPayload] = React.useState<TData[]>([]);
  const [errorEmail, setErrorEmail] = React.useState<{
    message: string;
    rowIndex: number;
    columnId: string;
  } | null>(null);
  const [errorPhone, setErrorPhone] = React.useState<{
    message: string;
    rowIndex: number;
    columnId: string;
  } | null>(null);
  const [newPayload, setNewPayload] =
    React.useState<TEmployeeSchema>(newPayloadExample);
  const [isNewPayload, setIsNewPayload] = React.useState<boolean>(false);
  const [editingCell, setEditingCell] = React.useState<{
    rowIndex: number;
    columnId: string;
  } | null>(null);

  const [editingCellArray, setEditingCellArray] = React.useState<
    | {
        rowIndex: number;
        columnId: string;
      }[]
    | null
  >(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });
  const { toggleShouldFetchNewData } = useCommonContext();

  const handleDoubleClick = (rowIndex: number, columnId: string) => {
    setEditingCell({ rowIndex, columnId });
  };

  const handleCellEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    columnId: string
  ) => {
    const newData = [...data];

    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: e.target.value,
    };

    setEditingCellArray(
      editingCellArray
        ? [...editingCellArray, { rowIndex, columnId }]
        : [{ rowIndex, columnId }]
    );
    const emailError = validateEmail(e.target.value, columnId);
    if (!emailError.success) {
      setErrorEmail({ message: "Invalid email", rowIndex, columnId });
    } else {
      setErrorEmail(null);
    }

    const phoneError = validatePhone(e.target.value, columnId);
    if (!phoneError.success) {
      setErrorPhone({ message: "Invalid phone number", rowIndex, columnId });
    } else {
      setErrorPhone(null);
    }
    setData(newData);
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    rowIndex: number
  ) => {
    setEditingCell(null);

    const newData = [...data];
    const newPayload = [...payload, newData[rowIndex]];
    setPayload(newPayload);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPayload && isNewPayload) {
      delete (newPayload as { id?: number }).id;
      const response = await ApiPost(newPayload);
      setNewPayload(newPayloadExample);
      setIsNewPayload(false);
      if (!response) {
        toast.error("Error", {
          description: "Could not save data" + response.message,
        });
        return;
      }
    }
    const promises = payload.map(async (item) => {
      const payload = item as TEmployeeSchema;
      return await ApiPut(payload, Number(payload.id));
    });
    await Promise.all(promises);

    setPayload([]);
    setEditingCell(null);
    setEditingCellArray(null);
    toast("Data has been saved", {
      description: new Date().toLocaleString("en-US"),
    });
    toggleShouldFetchNewData(true);
  };

  const handleUndo = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setData(oldData);
    setPayload([]);
    setEditingCellArray(null);
    setIsNewPayload(false);
    setNewPayload(newPayloadExample);
  };

  return (
    <>
      <form onSubmit={handleSave}>
        <div className="flex justify-end w-full items-center gap-1">
          <Button
            type="button"
            title="Save All Changes"
            size="icon"
            variant="ghost"
            onClick={() => setIsNewPayload(!isNewPayload)}
            className="my-5 hover:bg-neutral-200/85 transition-colors duration-300"
          >
            <Plus size={20} />
          </Button>
          <Button
            type="submit"
            title="Save All Changes"
            size="icon"
            variant="ghost"
            className="my-5 hover:bg-neutral-200/85 transition-colors duration-300"
            disabled={!payload.length && !isNewPayload}
          >
            <SaveAll size={20} />
          </Button>
          <Button
            type="button"
            title="Save All Changes"
            size="icon"
            variant="ghost"
            className="my-5 hover:bg-neutral-200/85 transition-colors duration-300"
            onClick={handleUndo}
          >
            <Undo2 size={20} />
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isNewPayload ? (
                <NewColumns
                  table={table}
                  editingCellArray={editingCellArray}
                  setEditingCellArray={setEditingCellArray}
                  editingCell={editingCell}
                  setEditingCell={setEditingCell}
                  isNewPayload={isNewPayload}
                  handleDoubleClick={handleDoubleClick}
                  newPayload={newPayload}
                  setNewPayload={setNewPayload}
                />
              ) : null}

              {data && data.length ? (
                table?.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onDoubleClick={() =>
                          handleDoubleClick(
                            parseInt(cell.row.id),
                            cell.column.id
                          )
                        }
                        className={cn(
                          "relative",
                          {
                            "bg-green-300": editingCellArray?.find(
                              (item) =>
                                item.rowIndex === parseInt(cell.row.id) &&
                                item.columnId === cell.column.id
                            ),
                          },
                          {
                            "border-b-2 border-blue-500 bg-transparent":
                              editingCell?.rowIndex === parseInt(cell.row.id) &&
                              editingCell?.columnId === cell.column.id,
                          },
                          {
                            "bg-red-300 border-red-300":
                              (errorEmail &&
                                errorEmail.rowIndex === parseInt(cell.row.id) &&
                                errorEmail.columnId === cell.column.id) ||
                              (errorPhone &&
                                errorPhone.rowIndex === parseInt(cell.row.id) &&
                                errorPhone.columnId === cell.column.id),
                          }
                        )}
                      >
                        {(errorEmail &&
                          errorEmail.rowIndex === parseInt(cell.row.id) &&
                          errorEmail.columnId === cell.column.id) ||
                        (errorPhone &&
                          errorPhone.rowIndex === parseInt(cell.row.id) &&
                          errorPhone.columnId === cell.column.id) ? (
                          <p className="absolute -bottom-5 left-0 text-sm z-20 rounded px-3 bg-red-400 text-white">
                            {errorEmail?.message || errorPhone?.message}
                          </p>
                        ) : null}
                        {editingCell?.rowIndex === parseInt(cell.row.id) &&
                        editingCell?.columnId === cell.column.id ? (
                          <Input
                            name={cell.column.id as keyof TEmployeeSchema}
                            value={cell.getValue() as string}
                            onChange={(e) => {
                              handleCellEdit(
                                e,
                                parseInt(cell.row.id),
                                cell.column.id
                              );
                            }}
                            onBlur={(e) => handleBlur(e, parseInt(cell.row.id))}
                            autoFocus
                            className="w-full h-full absolute inset-0 bg-transparent text-inherit font-inherit p-4 m-0 border-none outline-none focus:ring-0"
                          />
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </form>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
};
