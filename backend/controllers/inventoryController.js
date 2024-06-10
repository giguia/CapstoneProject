const Lead = require('../models/leadModel')
const UserLG = require('../models/userLGModel')
const Email = require('../models/emailModel')
const Inventory = require('../models/inventoryModel')

const typeEnum = ["Warehouse", "Restaurant", "Boutiques", "Salon", "Spa", "Manufacturing", "Hotel", "Gym", "Automotive", "Cafe", "Brewery", "Pet Shops", "Laundry", "Clinic"]
const callDispositionEnum = ["Not Eligible", "Already Installed", "Wrong/Not Working", "Booked", "Residential", "Callback", "Do Not Call", "No Answer", "Not Interested", "Voicemail", "Warm Lead", "Email"]

const updateInventoryCounts = async () => {
    const totalLeads = await Lead.countDocuments()
    const totalUsers = await UserLG.countDocuments()
    const totalEmails = await Email.countDocuments()
    const totalAssignedLeads = await Lead.countDocuments({ assignedTo: { $exists: true } })
    const totalUnassignedLeads = await Lead.countDocuments({ assignedTo: { $exists: false } })

    const typeCounts = await Promise.all(typeEnum.map(async (type) => {
        const count = await Lead.countDocuments({ type })
        return { type, count }
    }))

    const callDispositionCounts = await Promise.all(callDispositionEnum.map(async (disposition) => {
        const count = await Lead.countDocuments({ callDisposition: disposition })
        return { disposition, count }
    }))

    let inventory = await Inventory.findOne()

    if (!inventory) {
        inventory = new Inventory({
            numberOfLeads: totalLeads,
            numberOfUsers: totalUsers,
            numberOfAssignedLeads: totalAssignedLeads,
            numberOfUnassignedLeads: totalUnassignedLeads,
            typeCounts: typeCounts.reduce((acc, { type, count }) => {
                acc[type] = count
                return acc
            }, {}),
            callDispositionCounts: callDispositionCounts.reduce((acc, { disposition, count }) => {
                acc[disposition] = count
                return acc
            }, {})
        })
    } else {
        inventory.numberOfLeads = totalLeads
        inventory.numberOfUsers = totalUsers
        inventory.numberOfEmails = totalEmails
        inventory.numberOfAssignedLeads = totalAssignedLeads
        inventory.numberOfUnassignedLeads = totalUnassignedLeads
        inventory.typeCounts = typeCounts.reduce((acc, { type, count }) => {
            acc[type] = count
            return acc
        }, {})
        inventory.callDispositionCounts = callDispositionCounts.reduce((acc, { disposition, count }) => {
            acc[disposition] = count
            return acc
        }, {})

    }
    await inventory.save()
    return inventory
}

const getInventory = async (req, res) => {
    try {
        const inventory = await updateInventoryCounts()
        res.status(200).json(inventory)
    } catch (error) {
        console.error('Error updating inventory:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = { getInventory, updateInventoryCounts }