import { Box, IconButton, Modal, CircularProgress, Button, Snackbar } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import React, { useState } from 'react';
import { Delete, Visibility, Edit } from '@mui/icons-material';
import { useLeadsContext } from "../../hooks/useLeadsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import Header from '../Chart/Header';
import moment from 'moment';
import EditForm from '../../pages/leadgen/EditForm';
import ReadForm from '../../pages/leadgen/ReadForm';

const LeadDetails = ({ leads, userlgs }) => {
  const { dispatch } = useLeadsContext();
  const { userLG } = useAuthContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false); // State for delete loading
  const [errorDelete, setErrorDelete] = useState(null); // State for delete error
  const [showConfirmation, setShowConfirmation] = useState(false); // State for showing delete confirmation dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar open
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for Snackbar message
  const [openViewModal, setOpenViewModal] = useState(false); // State for ViewLead modal

  const userIdToNameMap = userlgs.reduce((acc, user) => {
    acc[user._id] = user.name;
    return acc;
  }, {});

  const handleClick = async (leadId) => {
    if (!userLG) {
      return;
    }
    setSelectedLeadId(leadId);
    setShowConfirmation(true);
  };

  const handleOpenAssignModal = (leadId) => {
    setSelectedLeadId(leadId);
    setOpenAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
    setSelectedLeadId(null);
  };

  const handleDeleteConfirmation = async () => {
    try {
      setLoadingDelete(true); // Start delete loading
      const response = await fetch(`/api/leads/${selectedLeadId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${userLG.token}`
        }
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "DELETE_LEAD", payload: json });
        setSnackbarMessage("Lead Deleted Successfully!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setErrorDelete('Error deleting lead.'); // Set delete error
      console.error('Error deleting lead:', error);
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

  const handleOpenViewModal = (leadId) => {
    setSelectedLeadId(leadId);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedLeadId(null);
  };

  const iconButtonStyle = { color: "#e0e0e0" };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
      minWidth: 90,
      renderCell: (params) => params.value.slice(20, 26)
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      minWidth: 280,
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "emailaddress",
      headerName: "Email",
      flex: 1,
      minWidth: 290,
    },
    {
      field: "userLG_id",
      headerName: "Lead By",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => userIdToNameMap[params.value] || params.value,
    },
    {
      field: "assignedTo",
      headerName: "Assigned To",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => userIdToNameMap[params.value] || params.value,
    },
    {
      field: "createdAt",
      headerName: "Lead Gen Date",
      flex: 1,
      minWidth: 150,
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
        title="LEADS"
        subtitle="List of Leads"
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
          rows={leads}
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
          <EditForm leadId={selectedLeadId} />
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
              <div>{errorDelete || 'Lead Deleted Successfully!'}</div> // Show error or success message
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
          <div>Are you sure you want to delete this lead?</div>
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
          {selectedLeadId && <ReadForm leadId={selectedLeadId} />}
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
      />
    </Box>
  );
};

export default LeadDetails;
