import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from 'react'

import Header from '../Chart/Header';
import moment from 'moment'

const Bookings = ({ recentBookings }) => {
    const [selectedRows, setSelectedRows] = useState([]);

    const columns = [
        {
            field: "_id",
            headerName: "ID",
            flex: 1,
            minWidth: 300,
            renderCell: (params) => params.value.slice(20, 26)
        },
        {
            field: "leadName",
            headerName: "Lead Name",
            flex: 1,
            minWidth: 570,
        },
        {
            field: "callDisposition",
            headerName: "Call Disposition",
            flex: 1,
            minWidth: 450,
            cellClassName: "name-column--cell",
        },
        {
            field: "telemarketerName",
            headerName: "Booked By",
            flex: 1,
            minWidth: 380,
        },
        {
            field: "createdAt",
            headerName: "Time",
            flex: 1,
            minWidth: 200,
            renderCell: (params) =>
                moment(params.row.createdAt).startOf('hour').fromNow()
        },
    ];

    return (
        <Box m="20px">
            <Header
                title="Recent Bookings"
                subtitle="List of Bookings"
            />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        color: "#e0e0e0"
                    },
                    "& .name-column--cell": {
                        color: "#94e2cd",
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#3e4396",
                        borderBottom: "none",
                        color: "#e0e0e0",
                        fontSize: "18px",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: "#101624",
                        fontSize: "17px",
                    },
                    "& .MuiDataGrid-headerContainer": {
                        borderTop: "none",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: "#3e4396",
                    },
                    "& .MuiCheckbox-root": {
                        color: `#b7ebde !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `#e0e0e0 !important`,
                    },
                }}
            >
                <DataGrid
                    rows={recentBookings}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    checkboxSelection
                    onSelectionModelChange={(newSelection) => {
                        setSelectedRows(newSelection);
                    }}
                    selectionModel={selectedRows}
                    slots={{
                        toolbar: GridToolbar,
                    }}
                    getRowId={row => row._id}
                />
            </Box>
        </Box>
    );
};

export default Bookings;