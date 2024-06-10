import React, { useEffect } from 'react'

// components
import LeadGenSidebar from '../../components/leadgen/LeadGenSidebar';
import LeadGenNavbar from '../../components/leadgen/LeadGenNavbar';
import ViewUserLG from '../../components/profile/ViewUserLG'
import { useUsersContext } from "../../hooks/useUsersContext";

const ReadUserLG = () => {
    const { dispatch } = useUsersContext();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/api/userLG/');
            const json = await response.json();

            if (response.ok) {
                dispatch({ type: 'SET_USERS', payload: json });
            }
        };

        fetchUsers();
    }, [dispatch]);

    return (
        <div className="flex">
            <LeadGenSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <LeadGenNavbar />
                <div className="p-1">
                    <ViewUserLG />
                </div>
            </div>
        </div>
    );
}

export default ReadUserLG