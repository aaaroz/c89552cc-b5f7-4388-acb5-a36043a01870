/* eslint-disable @typescript-eslint/no-unused-vars */
export interface SortFilter {
  first_name?: string;
  last_name?: string;
  position?: string;
  page?: number;
  email?: string;
  phone_number?: string;
}

export interface EmployeeProps {
  id?: number;
  first_name?: string;
  last_name?: string;
  position?: string;
  phone_number?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

const ApiGet = async () => {
  try {
    const response = await fetch(`http://localhost:5000/api/employees`);
    const employees = await response.json();

    return employees;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

const ApiPost = async (data: EmployeeProps) => {
  const response = await fetch("http://localhost:5000/api/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log("Failed to fetch data");
  }

  const employees = await response.json();
  return employees;
};

const ApiPut = async <T>(data: T, id: number): Promise<T> => {
  const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log("Failed to fetch data");
  }

  const employees = await response.json();
  return employees;
};

export { ApiGet, ApiPost, ApiPut };
