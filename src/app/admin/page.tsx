"use client";

import { useState, useEffect } from "react";
import { RequestStatus } from "@/lib/types/request";
import Dropdown from "../../components/atoms/Dropdown";
import Table from "../../components/tables/Table";

export default function ItemRequestsPage() {
  const [filter, setFilter] = useState<RequestStatus | "All">("All");
  const [itemRequests, setItemRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Fetch data on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/mock/request');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setItemRequests(data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (id: number, newStatus: RequestStatus) => {
    try {
      const response = await fetch('/api/mock/request', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Update the local state after successfully updating the status on the backend
      setItemRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? {
                ...request,
                status: newStatus,
              }
            : request
        )
      );
    } catch (error) {
      console.error(error);
      setIsError(true);
    }
  };

  // Filter requests based on selected tab
  const filteredRequests =
    filter === "All" ? itemRequests : itemRequests.filter((req) => req.status === filter);

  // Dropdown options for status
  const statusOptions = [
    RequestStatus.PENDING,
    RequestStatus.APPROVED,
    RequestStatus.COMPLETED,
    RequestStatus.REJECTED,
  ];

  // Column headers for the table
  const headers = ["Name", "Item Requested", "Created", "Updated", "Status"];

  // Render function for rows
  const renderRow = (request: any) => (
    <>
      <td className="border-b px-4 py-2">{request.requestorName}</td>
      <td className="border-b px-4 py-2">{request.itemRequested}</td>
      <td className="border-b px-4 py-2">{new Date(request.requestCreatedDate).toLocaleDateString()}</td>
      <td className="border-b px-4 py-2">
        {request.lastEditedDate
          ? new Date(request.lastEditedDate).toLocaleDateString()
          : new Date(request.requestCreatedDate).toLocaleDateString()}
      </td>
      <td className="border-b px-4 py-2">
        <Dropdown
          value={request.status}
          options={statusOptions}
          onChange={(newStatus) => handleStatusChange(request.id, newStatus as RequestStatus)}
        />
      </td>
    </>
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data. Please try again later.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-2xl font-bold mb-6">Item Requests</h1>
      <div className="flex gap-3">
        {["All", RequestStatus.PENDING, RequestStatus.APPROVED, RequestStatus.COMPLETED, RequestStatus.REJECTED].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as any)}
            className={`font-medium text-sm px-7 py-3 rounded-t-md ${
              filter === tab ? "text-white bg-blue-500" : "text-gray-600 bg-gray-100 hover:bg-blue-50"
            }`}
          >
            {tab === "All"
              ? "All"
              : tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Render the updated Table component */}
      <Table headers={headers} data={filteredRequests} renderRow={renderRow} />
    </div>
  );
}
