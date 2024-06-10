const BookedUnits = require('../models/BookedUnitsModel');
const RecentBooking = require('../models/recentBookingModel');
const Lead = require('../models/leadModel');
const mongoose = require('mongoose');
const UserLG = require('../models/userLGModel');

const getBookedUnitsPerformance = async (req, res) => {
    try {
        const performanceData = await updateBookedUnits();
        res.status(200).json(performanceData);
    } catch (error) {
        console.error('Error fetching booked units performance:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateBookedUnits = async () => {
    try {
        const allTelemarketers = await UserLG.find({ role: 'Telemarketer' }); // Fetch all telemarketer users
        const performanceData = [];

        await Promise.all(allTelemarketers.map(async (telemarketer) => {
            const telemarketerName = telemarketer.name;

            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const startOfToday = new Date(today.setHours(0, 0, 0, 0));
            const endOfToday = new Date(today.setHours(23, 59, 59, 999));
            const startOfYesterday = new Date(today);
            startOfYesterday.setDate(startOfToday.getDate() - 1);
            startOfYesterday.setHours(0, 0, 0, 0);
            const endOfYesterday = new Date(startOfYesterday);
            endOfYesterday.setHours(23, 59, 59, 999);

            const dailyBookings = await RecentBooking.countDocuments({
                telemarketerName,
                createdAt: {
                    $gte: startOfToday,
                    $lt: endOfToday
                }
            });

            const monthlyBookings = await RecentBooking.countDocuments({
                telemarketerName,
                createdAt: { $gte: firstDayOfMonth }
            });

            const totalBookings = await RecentBooking.countDocuments({ telemarketerName });

            // Calculate the total number of leads assigned to this telemarketer
            const totalAssignedLeads = await Lead.countDocuments({ assignedTo: telemarketer._id });

            // Calculate the number of leads assigned to this telemarketer today
            const assignedDaily = await Lead.countDocuments({
                assignedTo: telemarketer._id,
                updatedAt: {
                    $gte: startOfToday,
                    $lt: endOfToday
                }
            });

            // Calculate the number of leads assigned to this telemarketer yesterday
            const assignedYesterday = await Lead.countDocuments({
                assignedTo: telemarketer._id,
                updatedAt: {
                    $gte: startOfYesterday,
                    $lt: endOfYesterday
                }
            });

            const bookedUnits = await BookedUnits.findOneAndUpdate(
                { telemarketerName },
                {
                    telemarketerName,
                    bookedDaily: dailyBookings,
                    bookedMonth: monthlyBookings,
                    totalBooked: totalBookings,
                    totalAssignedLeads,
                    assignedDaily,
                    assignedYesterday
                },
                { new: true, upsert: true }
            );

            performanceData.push(bookedUnits);
        }));

        // Sort the performance data by createdAt in descending order
        performanceData.sort((a, b) => b.createdAt - a.createdAt);

        return performanceData;
    } catch (error) {
        console.error('Error updating booked units:', error);
        throw error;
    }
};

module.exports = { getBookedUnitsPerformance, updateBookedUnits };