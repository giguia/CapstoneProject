import React, { useState, useEffect } from 'react';
import { CircularProgress } from "@mui/material";

// components
import Bookings from "../../components/admin/Bookings"
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from "../../components/admin/AdminSidebar"

import { useLeadsContext } from "../../hooks/useLeadsContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AdminBookings = () => {
  const { recentBookings, dispatch } = useLeadsContext()
  const { userLG } = useAuthContext()
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchBookings = async () => {
      const response = await fetch('/api/leads/recent-bookings', {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_BOOKINGS', payload: json })
      }
      setLoading(false); // Set loading to false when data fetching is complete
    }

    fetchBookings()
  }, [dispatch, userLG])

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex flex-col w-full overflow-y-hidden">
        <AdminNavbar />
        <div className="p-1 flex-grow flex justify-center items-center">
          {loading ? (
            <CircularProgress />
          ) : (
              <div className="flex flex-col w-full items-center overflow-y-hidden">
                <div className="w-full">
                  <Bookings recentBookings={recentBookings} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AdminBookings;
