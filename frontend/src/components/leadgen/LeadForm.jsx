import { useState } from 'react';
import { useLeadsContext } from "../../hooks/useLeadsContext";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, CircularProgress, Modal, Grid } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const LeadForm = () => {
  const { dispatch } = useLeadsContext();
  const { userLG } = useAuthContext();

  const [leadData, setLeadData] = useState({
    name: '',
    type: '',
    phonenumber: '',
    streetaddress: '',
    city: '',
    postcode: '',
    emailaddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeadData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!userLG) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    const response = await fetch('/api/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userLG.token}`
      }
    });

    const json = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields || []);
    } else {
      setError(null);
      setLeadData({
        name: '',
        type: '',
        phonenumber: '',
        streetaddress: '',
        city: '',
        postcode: '',
        emailaddress: ''
      });
      setEmptyFields([]);
      setOpenSuccessModal(true);
      dispatch({ type: 'CREATE_LEAD', payload: json });
    }
  };

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
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 5,
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="title">Add New Lead</div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={leadData.name}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('name')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal" error={emptyFields.includes('type')}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                name="type"
                value={leadData.type}
                onChange={handleChange}
              >
                <MenuItem value=""><em>Choose One</em></MenuItem>
                <MenuItem value="Warehouse">Warehouse</MenuItem>
                <MenuItem value="Restaurant">Restaurant</MenuItem>
                <MenuItem value="Boutiques">Boutiques</MenuItem>
                <MenuItem value="Salon">Salon</MenuItem>
                <MenuItem value="Spa">Spa</MenuItem>
                <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                <MenuItem value="Hotel">Hotel</MenuItem>
                <MenuItem value="Gym">Gym</MenuItem>
                <MenuItem value="Automotive">Automotive</MenuItem>
                <MenuItem value="Cafe">Cafe</MenuItem>
                <MenuItem value="Brewery">Brewery</MenuItem>
                <MenuItem value="Pet Shops">Pet Shops</MenuItem>
                <MenuItem value="Laundry">Laundry</MenuItem>
                <MenuItem value="Clinic">Clinic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phonenumber"
              value={leadData.phonenumber}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('phonenumber')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address"
              name="streetaddress"
              value={leadData.streetaddress}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('streetaddress')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={leadData.city}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('city')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Postcode"
              name="postcode"
              value={leadData.postcode}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('postcode')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email Address"
              name="emailaddress"
              value={leadData.emailaddress}
              onChange={handleChange}
              margin="normal"
              error={emptyFields.includes('emailaddress')}
            />
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Button variant="contained" type="submit" fullWidth>
                {loading ? <CircularProgress size={24} /> : "Submit"}
              </Button>
            </Box>
          </Grid>
          {error && <Grid item xs={12}><div className="error">{error}</div></Grid>}
        </Grid>
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
          <div className="success">New lead added!</div>
        </Box>
      </Modal>
    </Box>
  );
};

export default LeadForm;