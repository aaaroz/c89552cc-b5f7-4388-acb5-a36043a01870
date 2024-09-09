"use client";
import * as React from "react";
import { DataTable } from "./data-table";
import { columns, TEmployeeSchema } from "./columns";
import { ApiGet } from "@/lib/api";
import useCommonContext from "@/lib/hooks/common";

export const MainModule: React.FC = (): React.ReactElement => {
  const [employee, setEmployee] = React.useState<TEmployeeSchema[]>([]);
  const [oldData, setOldData] = React.useState<TEmployeeSchema[]>([]);
  const { shouldFetchNewData, toggleShouldFetchNewData } = useCommonContext();

  React.useEffect(() => {
    const fetchData = async () => {
      const { data } = await ApiGet();
      setEmployee(data);
      setOldData(data);
    };

    if (shouldFetchNewData) {
      fetchData();
      toggleShouldFetchNewData(false);
    }
    fetchData();
  }, [shouldFetchNewData, toggleShouldFetchNewData]);
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        oldData={oldData}
        data={employee}
        setData={setEmployee}
      />
    </div>
  );
};
