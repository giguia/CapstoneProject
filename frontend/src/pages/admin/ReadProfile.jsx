import React, { useEffect } from 'react'

// components
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ViewProfile from '../../components/admin/ViewProfile'
import { useUsersContext } from "../../hooks/useUsersContext";

const ReadProfile = () => {

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
            <AdminSidebar />
            <div className="flex flex-col w-full overflow-y-hidden">
                <AdminNavbar />
                <div className="p-1">
                    <ViewProfile />
                </div>
            </div>
        </div>
    );
}

export default ReadProfile