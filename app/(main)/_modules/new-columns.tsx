/* eslint-disable @typescript-eslint/no-unused-vars */
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import * as React from "react";
import { TEmployeeSchema } from "./columns";
import { Table } from "@tanstack/react-table";
import { validateEmail, validatePhone } from "./data-table";

interface NewColumnsProps<TData> {
  table: Table<TData>;
  newPayload: TEmployeeSchema;
  setNewPayload: React.Dispatch<React.SetStateAction<TEmployeeSchema>>;
  editingCellArray:
    | {
        rowIndex: number;
        columnId: string;
      }[]
    | null;
  setEditingCellArray: React.Dispatch<
    React.SetStateAction<
      | {
          rowIndex: number;
          columnId: string;
        }[]
      | null
    >
  >;
  editingCell: {
    rowIndex: number;
    columnId: string;
  } | null;
  setEditingCell: React.Dispatch<
    React.SetStateAction<{
      rowIndex: number;
      columnId: string;
    } | null>
  >;
  isNewPayload: boolean;
  handleDoubleClick: (rowIndex: number, columnId: string) => void;
}
export const NewColumns = <TData, _TValue>({
  table,
  editingCellArray,
  setEditingCellArray,
  editingCell,
  setEditingCell,
  isNewPayload,
  handleDoubleClick,
  newPayload,
  setNewPayload,
}: NewColumnsProps<TData>): React.ReactElement => {
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
  const keys = Object.keys(newPayload) as (keyof TEmployeeSchema)[];
  const handleCellNewEdit = (
    e: React.ChangeEvent<HTMLInputElement>,
    columnId: string
  ) => {
    const rowIndex = 0;
    setEditingCellArray(
      editingCellArray
        ? [...editingCellArray, { rowIndex, columnId }]
        : [{ rowIndex, columnId }]
    );
    const emailError = validateEmail(
      e.target.value,
      Number(columnId) === 5 ? "email" : columnId
    );
    console.log(columnId);
    if (!emailError.success) {
      setErrorEmail({ message: "Invalid email", rowIndex, columnId });
    } else {
      setErrorEmail(null);
    }
    const phoneError = validatePhone(
      e.target.value,
      Number(columnId) === 4 ? "phone_number" : columnId
    );
    if (!phoneError.success) {
      setErrorPhone({ message: "Invalid phone number", rowIndex, columnId });
    } else {
      setErrorPhone(null);
    }
    if (isNewPayload) {
      switch (columnId) {
        case "1":
          setNewPayload({ ...newPayload, first_name: e.target.value });
          break;
        case "2":
          setNewPayload({ ...newPayload, last_name: e.target.value });
          break;
        case "3":
          setNewPayload({ ...newPayload, position: e.target.value });
          break;
        case "4":
          setNewPayload({ ...newPayload, phone_number: e.target.value });
          break;
        case "5":
          setNewPayload({ ...newPayload, email: e.target.value });
          break;
        default:
          break;
      }
    }
  };
  const handleBlur = () => {
    setEditingCell(null);
  };
  return (
    <TableRow>
      {Array.from({
        length: table.getVisibleLeafColumns().length,
      }).map((_, i) => {
        const value = newPayload[keys[i + 1]];
        return (
          <TableCell
            key={i}
            className={cn(
              "relative px-4 text-left align-middle font-medium",
              {
                "bg-green-300": editingCellArray?.find(
                  (item) => item.rowIndex === 0 && item.columnId === `${i + 1}`
                ),
              },
              {
                "border-b-2 border-blue-500 bg-transparent":
                  editingCell?.rowIndex === 0 &&
                  editingCell?.columnId === `${i + 1}`,
              },
              {
                "bg-red-300 border-red-300":
                  (errorEmail &&
                    errorEmail.rowIndex === 0 &&
                    errorEmail.columnId === `${i + 1}`) ||
                  (errorPhone &&
                    errorPhone.rowIndex === 0 &&
                    errorPhone.columnId === `${i + 1}`),
              }
            )}
            onClick={() => handleDoubleClick(0, `${i + 1}`)}
          >
            {(errorEmail &&
              errorEmail.rowIndex === 0 &&
              errorEmail.columnId === `${i + 1}`) ||
            (errorPhone &&
              errorPhone.rowIndex === 0 &&
              errorPhone.columnId === `${i + 1}`) ? (
              <p className="absolute -bottom-5 left-0 text-sm z-20 rounded px-3 bg-red-400 text-white">
                {errorEmail?.message || errorPhone?.message}
              </p>
            ) : null}
            {editingCell?.rowIndex === 0 &&
            editingCell?.columnId === `${i + 1}` ? (
              <Input
                name={`${i + 1}` as keyof TEmployeeSchema}
                value={value}
                onChange={(e) => {
                  handleCellNewEdit(e, `${i + 1}`);
                }}
                onBlur={handleBlur}
                autoFocus
                className="w-full h-full absolute inset-0 bg-transparent text-inherit font-inherit p-4 m-0 border-none outline-none focus:ring-0"
              />
            ) : (
              <span className={cn({ "text-white": !value })}>
                {value ? value : "0"}
              </span>
            )}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
