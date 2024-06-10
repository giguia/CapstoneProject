import React, { useState, useEffect } from 'react';
import { CircularProgress } from "@mui/material";

// components
import UserLists from "../../components/admin/UserLists"
import AdminSidebar from "../../components/admin/AdminSidebar"
import AdminNavbar from '../../components/admin/AdminNavbar'

import { useUsersContext } from "../../hooks/useUsersContext"


const AdminUsers = () => {
  const { userlgs, dispatch } = useUsersContext()
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/userLG')
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_USERS', payload: json })
      }
      setLoading(false);
    }

    fetchUsers()
  }, [dispatch])


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
                  <UserLists userlgs={userlgs} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsers