import { Box, Button, Typography } from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { ContactsOutlined } from "@mui/icons-material";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

import AssignmentIcon from '@mui/icons-material/Assignment';
import Header from '../Chart/Header';

import StatBox from '../Chart/StatBox';
import moment from 'moment';


const LGDashboardTabs = ({ leadGenStats, leads }) => {

    const totalLeadsProgress = (leadGenStats.leadsCreated / leadGenStats.leadsCreated) * 100;
    const totalLeadsIncrease = ((leadGenStats.leadsCreated / leadGenStats.leadsCreated) * 100).toFixed(2);
    const assignedLeadsIncrease = ((leadGenStats.leadsCreated - leadGenStats.leadsAvailable) / leadGenStats.leadsCreated * 100).toFixed(2);
    const unassignedLeadsIncrease = ((leadGenStats.leadsCreated - leadGenStats.leadsAssigned) / leadGenStats.leadsCreated * 100).toFixed(2);
    const formattedDate = moment(leadGenStats.updatedAt).format('MMMM Do YYYY, h:mm:ss a');

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Header title="DASHBOARD" subtitle={`as of ${formattedDate}`} />

                <Box>
                    <Button
                        sx={{
                            backgroundColor: "#3e4396",
                            color: "#e0e0e0",
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Download Reports
          </Button>
                </Box>
            </Box>

            {/* GRID & CHARTS */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >
                {/* ROW 1 */}
                <Box
                    gridColumn="span 3"
                    backgroundColor="#141b2d"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={leadGenStats.leadsCreatedToday}
                        subtitle="Leads Today"
                        progress={leadGenStats.leadsCreatedToday}
                        increase={leadGenStats.leadsCreatedToday}
                        icon={
                            <ContactsOutlined
                                sx={{ color: "#4cceac", fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor="#141b2d"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={leadGenStats.leadsCreated}
                        subtitle="Total Leads"
                        progress={totalLeadsProgress}
                        increase={`${totalLeadsIncrease}%`}
                        icon={
                            <ContactsOutlined
                                sx={{ color: "#4cceac", fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor="#141b2d"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={leadGenStats.leadsAssigned}
                        subtitle="Leads Assigned"
                        progress={leadGenStats.leadsCreated - leadGenStats.leadsAvailable}
                        increase={`${assignedLeadsIncrease}%`}
                        icon={
                            <AssignmentTurnedInIcon
                                sx={{ color: "#4cceac", fontSize: "26px" }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    backgroundColor="#141b2d"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={leadGenStats.leadsAvailable}
                        subtitle="Leads Available"
                        progress={leadGenStats.leadsCreated - leadGenStats.leadsAssigned}
                        increase={`${unassignedLeadsIncrease}%`}
                        icon={
                            <AssignmentIcon
                                sx={{ color: "#4cceac", fontSize: "26px" }}
                            />
                        }
                    />
                </Box>

                {/* ROW 3 */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 4"
                    backgroundColor="#141b2d"
                    overflow="auto"
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid #1F2A40`}
                        colors="#e0e0e0"
                        p="15px"
                    >
                        <Typography color="#e0e0e0" variant="h5" fontWeight="600">
                            Recent Leads
        </Typography>
                    </Box>
                    {leads.map((lead) => (
                        <Box
                            key={lead._id}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid #1F2A40`}
                            p="15px"
                        >
                            <Box flex="2">
                                <Typography color="#e0e0e0" variant="body1">
                                    {lead.name}
                                </Typography>
                            </Box>
                            <Box flex="1">
                                <Typography color="#e0e0e0" variant="body1">
                                    {lead.city}
                                </Typography>
                            </Box>
                            <Box
                                flex="1"
                                backgroundColor="#4cceac"
                                p="5px 10px"
                                borderRadius="4px"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Typography color="#141b2d" variant="body1">
                                    {lead.type}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>
                <Box
                    gridColumn="span 4"
                    gridRow="span 4"
                    backgroundColor="#141b2d"
                    overflow="auto"
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid #1F2A40`}
                        colors="#e0e0e0"
                        p="15px"
                    >
                        <Typography color="#e0e0e0" variant="h5" fontWeight="600">
                            Types Created
                    </Typography>
                    </Box>
                    {leadGenStats.typesCreated &&
                        Object.entries(leadGenStats.typesCreated).map(([type, count]) => (
                            <Box
                                key={type}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                borderBottom={`4px solid #1F2A40`}
                                p="25px"
                            >
                                <Typography color="#e0e0e0">{type}</Typography>
                                <Typography color="#e0e0e0">{count}</Typography>
                            </Box>
                        ))}
                </Box>

            </Box>
        </Box>
    );
};

export default LGDashboardTabs;