import React, { useState } from 'react'
import { Box, Button, TextField } from "@mui/material";
import { FormControl, InputLabel, Select as MuiSelect, MenuItem } from '@mui/material';

import Header from '../Chart/Header';
import { useUsersContext } from "../../hooks/useUsersContext"
import { useAuthContext } from "../../hooks/useAuthContext"

const AddUser = () => {
    const { dispatch } = useUsersContext()
    const { userLG } = useAuthContext()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!userLG) {
            setError('You must be logged in')
            return
        }

        const user = { name, email, password, role }

        const response = await fetch('/api/userLG/signup', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userLG.token}`
            }
        })
        const json = await response.json()

        if (!response.ok) {
            setError(json.error)
        }
        if (response.ok) {
            setError(null)
            setName('')
            setEmail('')
            setPassword('')
            setRole('')
            console.log('new user added:', json)
            dispatch({ type: 'CREATE_USER', payload: json })
        }

    }

    const roles = [
        { value: 'Lead Generation', label: 'Lead Generation' },
        { value: 'Telemarketer', label: 'Telemarketer' },
        { value: 'Team Leader', label: 'Team Leader' },
    ]

    return (
        <Box m="20px" width="1950px">
            <Header title="CREATE USER" subtitle="Create a New User Profile" />

            <form onSubmit={handleSubmit}>
                <Box
                    display="grid"
                    gap="30px"
                    gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                >
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Full Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        name="fullName"
                        sx={{ gridColumn: "span 4", backgroundColor: "#c2c2c2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="text"
                        label="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        name="email"
                        sx={{ gridColumn: "span 4", backgroundColor: "#c2c2c2" }}
                    />
                    <TextField
                        fullWidth
                        variant="filled"
                        type="password"
                        label="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        name="password"
                        sx={{ gridColumn: "span 4", backgroundColor: "#c2c2c2" }}
                    />

                    <FormControl variant="outlined" fullWidth sx={{ gridColumn: "span 4", backgroundColor: "#c2c2c2" }}>
                        <InputLabel id="role" >Select Role</InputLabel>
                        <MuiSelect
                            label="Select Role"
                            labelId="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="">None</MenuItem>
                            {
                                roles.map(
                                    role => (<MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>)
                                )
                            }
                        </MuiSelect>
                    </FormControl>
                </Box>

                <Box display="flex" justifyContent="end" mt="30px">
                    <Button type="submit" color="secondary" variant="contained">
                        Create New User
              </Button>
                </Box>
                {error && <div>{error}</div>}
            </form>
        </Box>
    )
}

export default AddUser;
