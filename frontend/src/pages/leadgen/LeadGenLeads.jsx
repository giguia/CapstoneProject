import React, { useState, useEffect } from 'react';
import { CircularProgress } from "@mui/material";

// components
import LeadDetails from "../../components/leadgen/LeadDetails"
import LeadGenNavbar from '../../components/leadgen/LeadGenNavbar'
import LeadGenSidebar from "../../components/leadgen/LeadGenSidebar"

import { useLeadsContext } from "../../hooks/useLeadsContext"
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const LeadGenLeads = () => {
  const { leads, dispatch } = useLeadsContext()
  const { userlgs, dispatch: dispatchUsers } = useUsersContext()
  const { userLG } = useAuthContext()
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const fetchLeads = async () => {
      const response = await fetch('/api/leads', {
        headers: { 'Authorization': `Bearer ${userLG.token}` },
      })
      const json = await response.json()

      if (response.ok) {
        dispatch({ type: 'SET_LEADS', payload: json })
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
      <LeadGenSidebar />
      <div className="flex flex-col w-full overflow-y-hidden">
        <LeadGenNavbar />
        <div className="p-1 flex-grow flex justify-center items-center">
          {loading ? (
            <CircularProgress />
          ) : (
              <div className="flex flex-col w-full items-center overflow-y-hidden">
                <div className="w-full">
                  <LeadDetails leads={leads} userlgs={userlgs} />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default LeadGenLeads;