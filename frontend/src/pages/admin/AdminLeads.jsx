import React, { useState, useEffect } from 'react';
import { CircularProgress } from "@mui/material";

// components
import LeadList from "../../components/admin/LeadList"
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from "../../components/admin/AdminSidebar"

import { useLeadsContext } from "../../hooks/useLeadsContext"
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AdminLeads = () => {
  const { tlLeads, dispatch } = useLeadsContext()
  const { userlgs, dispatch: dispatchUsers } = useUsersContext()
  const { userLG } = useAuthContext()
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchLeads = async () => {
      const response = await fetch('/api/leads/tl', {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_TL_LEADS', payload: json })
      }
      setLoading(false); // Set loading to false when data fetching is complete
    }

    fetchLeads()
  }, [dispatch, userLG])

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/userLG')
      const json = await response.json()

      if (response.ok) {
        dispatchUsers({ type: 'SET_USERS', payload: json })
      }
    }

    fetchUsers()
  }, [dispatchUsers])

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
                  <LeadList tlLeads={tlLeads} userlgs={userlgs} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AdminLeads;