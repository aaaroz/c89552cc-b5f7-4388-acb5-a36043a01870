"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { z } from "zod";

export type TEmployeeSchema = z.infer<typeof EmployeeSchema>;
export const EmployeeSchema = z.object({
  id: z.number(),
  first_name: z
    .string({ required_error: "first name is required!" })
    .min(3, { message: "this value minimum is 3 length" }),
  last_name: z
    .string({ required_error: "last name is required!" })
    .min(3, { message: "this value minimum is 3 length" }),
  position: z
    .string({ required_error: "position is required!" })
    .min(3, { message: "this value minimum is 3 length" }),
  phone_number: z
    .string({ required_error: "phone is required!" })
    .min(10, { message: "phone number must be at least 10 characters" }),
  email: z
    .string({ required_error: "email is required!" })
    .email({ message: "Please enter a valid email" }),
});

export const columns: ColumnDef<TEmployeeSchema>[] = [
  {
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          First Name{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            column.getIsSorted() === "desc" && <ArrowDown size={14} />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Last Name{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            column.getIsSorted() === "desc" && <ArrowDown size={14} />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Position{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            column.getIsSorted() === "desc" && <ArrowDown size={14} />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "phone_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Phone{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            column.getIsSorted() === "desc" && <ArrowDown size={14} />
          )}
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Email{" "}
          {column.getIsSorted() === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            column.getIsSorted() === "desc" && <ArrowDown size={14} />
          )}
        </Button>
      );
    },
  },
];
