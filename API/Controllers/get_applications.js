const PrismaClient = require("@prisma/client").PrismaClient;
const db = new PrismaClient();  

const getApplications = async (req, res) => {
    const userId = req.user.userId; // Extract user ID from the request object

    try {
        // Fetch all applications for the user
        const applications = await db.application_infos.findMany({
            where: { user_id: userId },
            orderBy: { application_date: 'desc' }, // Order by application date, most recent first
        });

        // Return the applications
        res.status(200).json({
            message: "Applications retrieved successfully.",
            applications,
        });
    } catch (error) {
        console.error("Error retrieving applications:", error);
        res.status(500).json({ error: "Server error while retrieving applications." });
    }
}
module.exports = { getApplications };