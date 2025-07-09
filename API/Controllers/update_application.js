const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

// This function deletes an application based on the application ID provided in the request parameters.
const deleteApplication = async (req, res) => {
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

    await db.application_infos.delete({
      where: { application_id: parsedId },
    });

    return res.status(200).json({
      message: "Application deleted successfully",
      applicationId: parsedId,
    });

  } catch (error) {
        // console.error(`Error occurred during deletion:`, error);
        return res.status(500).json({ error: `Server error. Deletion failed. ${error} ` });
  }
};

// This function updates the status of an application based on the application ID and new status provided in the request body.
const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;
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

    const updatedApplication = await db.application_infos.update({
      where: { application_id: parsedId },
      data: { status },
    });

    return res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });

  } catch (error) {
    // console.error(`Error occurred during status update:`, error);
    return res.status(500).json({ error: `Server error. Status update failed. ${error}` });
  }
}

const updateApplicationNote = async (req, res) => {
  const { applicationId } = req.params;
  const { personalNote } = req.body;

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

    const updatedApplication = await db.application_infos.update({
      where: { application_id: parsedId },
      data: { personal_note: personalNote },
    });

    return res.status(200).json({
      message: "Application note updated successfully",
      application: updatedApplication,
    });

  } catch (error) {
    // console.error(`Error occurred during note update:`, error);
    return res.status(500).json({ error: `Server error. Note update failed. ${error}` });
  }
}

module.exports = {deleteApplication , updateApplicationStatus};
