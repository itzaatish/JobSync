const PrismaClient = require("@prisma/client").PrismaClient;
const db = new PrismaClient();

const getSingleApplication = async (req, res) => {
    const { applicationId } = req.params;

    try {
        const parsedId = parseInt(applicationId);

        if (isNaN(parsedId)) {
            return res.status(400).json({ error: "Invalid application ID" });
        }

        const application = await db.application_infos.findUnique({
            where: { application_id: parsedId },
        });

        if (!application) {
            return res.status(404).json({ error: "No such application found" });
        }

        return res.status(200).json({
            message: "Application retrieved successfully",
            application,
        });

    } catch (error) {
        // console.error("Error retrieving application:", error);
        return res.status(500).json({ error: `Server error while retrieving application. ${error}` });
    }
}

module.exports = { getSingleApplication };