const PrismaClient = require("@prisma/client").PrismaClient;
const db = new PrismaClient();
const jwt = require("jsonwebtoken");

const createNewApplication = async (req, res) => {
    const applicationData = req.body;
    const userId = req.user.userId; 

    try {
        // Validate the application data
        if (!applicationData.CompanyName){
            return res.status(400).json({ error: "Company name is required." });
        }

        // Create a new application in the database
        const newApplication = await db.application_infos.create({
            data: {
                user_id: userId,
                company_name: applicationData.CompanyName.trim(),
                job_title: applicationData.JobTitle ? applicationData.JobTitle.trim() : null,
                resume_used: applicationData.ResumeUsed ? applicationData.ResumeUsed.trim() : null,
                cover_letter_used: applicationData.CoverLetterUsed ? applicationData.CoverLetterUsed.trim() : null,
                status: applicationData.Status ? applicationData.Status.trim() : 'APPLIED',
                application_date: new Date(applicationData.ApplicationDate) ,
                personal_note: applicationData.PersonalNotes ? applicationData.PersonalNotes.trim() : null,
            }
        });
        // Updating the user with it newly created application
        await db.users_info.update({
            where: {user_id: userId},
            data: {
                applications: {
                    connect: { application_id: newApplication.application_id }
                }
            }
        })

        // Return the newly created application
        res.status(201).json({
            message : "New application created successfully.",
            newApplication,
        });
    }catch (error) {
        // console.error("Error creating new application:", error);
        res.status(500).json({ error: `Server error while creating application. ${error}` });
    }
}

module.exports = { createNewApplication };