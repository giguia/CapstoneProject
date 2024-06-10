import { useState, useEffect } from 'react'
import { useLeadsContext } from "../../hooks/useLeadsContext"
import { useAuthContext } from '../../hooks/useAuthContext'
import { Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Modal from '@mui/material/Modal';

const AssignLead = ({ userlgs, leadId }) => {
  const { tlLeads, dispatch } = useLeadsContext()
  const { userLG } = useAuthContext()

  const [leadData, setLeadData] = useState({
    assignedTo: ''
  })
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [error, setError] = useState(null)
  const [openSuccessModal, setOpenSuccessModal] = useState(false); // State for success modal


  useEffect(() => {
    // Fetch the lead details based on the ID
    const lead = tlLeads.find(lead => lead._id === leadId)
    if (lead) {
      setLeadData({
        assignedTo: lead.assignedTo || ''
      })
    }
  }, [leadId, tlLeads])

  const handleChange = (e) => {
    const { name, value } = e.target
    setLeadData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); // Start loading

    // Send the updated lead data to the backend for updating
    const response = await fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      body: JSON.stringify(leadData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userLG.token}`
      }
    })
    const json = await response.json()

    setLoading(false); // Stop loading

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      setOpenSuccessModal(true);
      // Update the lead in the local state
      dispatch({ type: 'UPDATE_TL_LEAD', payload: json })
    }
  }

  const handleCloseSuccessModal = () => {
    setOpenSuccessModal(false);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 6,
      }}
    >
      <form onSubmit={handleSubmit}>
        <div>Assign Lead</div>
        <div>
          <FormControl fullWidth>
            <InputLabel id="assignedTo-label">Assign To:</InputLabel>
            <Select
              labelId="assignedTo-label"
              id="assignedTo"
              name="assignedTo"
              value={leadData.assignedTo}
              onChange={handleChange}
              required
            >
              <MenuItem value="">
                <em>Select User</em>
              </MenuItem>
              {userlgs && userlgs.map((userlg) => (
                <MenuItem key={userlg._id} value={userlg._id}>
                  {userlg.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2}>
            <Button variant="contained" type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Box>
          {error && <div className="error">{error}</div>}
        </div>
      </form>
      <Modal
        open={openSuccessModal}
        onClose={handleCloseSuccessModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
          <CheckCircleIcon sx={{ color: '#94e2cd', fontSize: 60 }} />
          <div className="success">Assigned Successfully!</div>
        </Box>
      </Modal>
    </Box>
  );
};

export default AssignLead;