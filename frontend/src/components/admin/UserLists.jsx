import { Box, IconButton, Modal, CircularProgress, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Delete, Visibility, Edit } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useState } from 'react'
import { useUsersContext } from "../../hooks/useUsersContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import Header from '../Chart/Header';
import moment from 'moment'
import EditUserInfo from '../../pages/profile/EditUserInfo';
import ReadUserInfo from '../../pages/profile/ReadUserInfo';

const UserLists = ({ userlgs }) => {
  const { dispatch } = useUsersContext();
  const { userLG } = useAuthContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false); // State for delete loading
  const [errorDelete, setErrorDelete] = useState(null); // State for delete error
  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing delete confirmation dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message
  const [openViewModal, setOpenViewModal] = useState(false); // State for ViewLead modal

  const handleClick = async (userId) => {
    if (!userLG) {
      return;
    }
    setSelectedUserId(userId);
    setShowConfirmation(true);
  };

  const handleOpenAssignModal = (userId) => {
    setSelectedUserId(userId);
    setOpenAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
    setSelectedUserId(null);
  };

  const handleDeleteConfirmation = async () => {
    try {
      setLoadingDelete(true); // Start delete loading
      const response = await fetch(`/api/leads/${selectedUserId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${userLG.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_USER", payload: json });
        setSnackbarMessage("User Deleted Successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setErrorDelete('Error deleting user.'); // Set delete error
      console.error('Error deleting user:', error);
    } finally {
      setLoadingDelete(false); // Stop delete loading
      setShowConfirmation(false); // Close confirmation dialog
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false); // Close confirmation dialog
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleOpenViewModal = (userId) => {
    setSelectedUserId(userId);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedUserId(null);
  };

  const iconButtonStyle = { color: "#e0e0e0" };

  // Custom rendering function for boolean values
  const renderBooleanCell = (params) => {
    return (
      <div className="flex items-center h-full ml-4">
        {params.value ? (
          <div className="w-3 h-3 rounded-full bg-green-500"></div> // Green circle for true
        ) : (
            <div className="w-3 h-3 rounded-full bg-red-500"></div> // Red circle for false
          )}
      </div>
    );
  };

  // Custom rendering function for gender
  const renderGenderCell = (params) => {
    if (!params.value) {
      return null // If gender value is empty, return null (or render something else)
    }
    return (
      <div className="flex items-center h-full mr-3 mb-4">
        <div className={params.value === 'Male' ? 'flex items-center justify-center bg-blue-800 text-white text-center rounded-full w-20 h-6' : 'flex items-center justify-center bg-pink-600 text-white text-center rounded-full w-20 h-6'}>
          {params.value}
        </div>
      </div>
    );
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => params.value.slice(20, 26)
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 200,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      minWidth: 250,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      minWidth: 220,
    },
    {
      field: "gender",
      headerName: "Gender",
      flex: 1,
      minWidth: 200,
      renderCell: renderGenderCell,
    },
    {
      field: "number",
      headerName: "Phone Number",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "birthday",
      headerName: "Birthday",
      flex: 1,
      minWidth: 180,
      renderCell: (params) =>
        moment(params.row.birthday).format('YYYY-MM-DD'),
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 1,
      minWidth: 150,
      renderCell: renderBooleanCell,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      minWidth: 180,
      renderCell: (params) =>
        moment(params.row.createdAt).format('MMM-D-YYYY'),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleOpenViewModal(params.row._id)} style={iconButtonStyle}><Visibility /></IconButton>
          <IconButton onClick={() => handleClick(params.row._id)} style={iconButtonStyle}><Delete /></IconButton>
          <IconButton onClick={() => handleOpenAssignModal(params.row._id)} style={iconButtonStyle}><Edit /></IconButton>
        </Box>
      )
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Chromagen Staffs"
        subtitle="List of Users"
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
            color: "#e0e0e0",
          },
          "& .name-column--cell": {
            color: "#94e2cd",
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#3e4396",
            borderBottom: "none",
            color: "#e0e0e0",
            fontSize: "18px"
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#101624",
            fontSize: "17px"
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
          rows={userlgs}
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
      <Modal
        open={openAssignModal}
        onClose={handleCloseAssignModal}
        aria-labelledby="assign-lead-modal-title"
        aria-describedby="assign-lead-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <EditUserInfo userId={selectedUserId} />
        </Box>
      </Modal>
      <Modal
        open={loadingDelete}
        onClose={() => setLoadingDelete(false)}
        aria-labelledby="delete-lead-modal-title"
        aria-describedby="delete-lead-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          {loadingDelete ? (
            <CircularProgress /> // Show CircularProgress while deleting
          ) : (
              <div>{errorDelete || 'User Deleted Successfully!'}</div> // Show error or success message
            )}
        </Box>
      </Modal>
      <Modal
        open={showConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="delete-confirmation-modal-title"
        aria-describedby="delete-confirmation-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            textAlign: 'center',
          }}
        >
          <div>Are you sure you want to delete this user?</div>
          <Button onClick={handleDeleteConfirmation}>Yes</Button>
          <Button onClick={handleCloseConfirmation}>No</Button>
        </Box>
      </Modal>
      <Modal
        open={openViewModal}
        onClose={handleCloseViewModal}
        aria-labelledby="view-lead-modal-title"
        aria-describedby="view-lead-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '80%',
            overflow: 'auto',


          }}
        >
          {selectedUserId && <ReadUserInfo userId={selectedUserId} />}
        </Box>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={<CheckCircleIcon sx={{ color: '#94e2cd' }} />}
      />
    </Box>
  );
};

export default UserLists;