import React, { useState, useEffect } from 'react';
import { CircularProgress } from "@mui/material";

// components
import EmailList from "../../components/admin/EmailList"
import AdminNavbar from '../../components/admin/AdminNavbar'
import AdminSidebar from "../../components/admin/AdminSidebar"

import { useEmailsContext } from "../../hooks/useEmailsContext"
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AdminEmails = () => {
  const { emails, dispatch } = useEmailsContext()
  const { userlgs, dispatch: dispatchUsers } = useUsersContext()
  const { userLG } = useAuthContext()
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchEmails = async () => {
      const response = await fetch('/api/emails/tl', {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_EMAILS', payload: json })
      }
      setLoading(false); // Set loading to false when data fetching is complete
    }

    fetchEmails()
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
                  <EmailList emails={emails} userlgs={userlgs} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default AdminEmails;