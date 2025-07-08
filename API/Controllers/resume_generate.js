const ModelClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");
const dotenv = require("dotenv");
const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');

dotenv.config();

const endpoint = "https://models.github.ai/inference"; 
const model = "openai/gpt-4.1"; 
const token = process.env.GPT_API_KEY;

// This function takes in the path of the Raw resume and job description files 
// And will call the OpenAI API to generate a new resume in HTML format 
// This function will return the file path of generated HTML resume

const ResumeParsing = async (resumeRaw , description) => {
  let resumeContent, jobDescription, resumeFileName, resumeFilePath;

  try {
    if(fs.existsSync(resumeRaw) && fs.existsSync(description)){
        resumeContent = fs.readFileSync(resumeRaw, 'utf8');
        jobDescription = fs.readFileSync(description, 'utf8');

        fs.unlinkSync(resumeRaw); // Delete the raw resume file after reading
        fs.unlinkSync(description); // Delete the job description file after reading
    }else{
        throw new Error("Resume or job description file not found While Parsing Through OpenAI api.");
    }
    const messages = [
    {
      role: "system",
      content: `You are a professional resume writer and career consultant with deep expertise in applicant tracking systems (ATS), keyword optimization, and HTML formatting for backend parsing.

    Your job is to rewrite and optimize a candidate’s resume to align with a job description. You must use only the candidate’s provided content — do NOT fabricate, or invent any data , you should exaggerate the give data , try to add performance statistics and number wherever possible like in projects and Experince Sections . The final output must be valid HTML, styled using inline CSS only, and structured strictly for automated parsing by backend systems.`,
      },
      {
        role: "user",
        content: 
    `Here is the job description:\n${jobDescription}\n\n
    Here is the candidate’s resume:\n${resumeContent}\n\n

    ⚠️ STRICT OUTPUT INSTRUCTIONS:

    📦 HTML STRUCTURE REQUIREMENTS:
    1. Wrap the entire content inside a complete <html> document with <head> and <body>.
    2. Donot use CSS just Provide the Structure.
    3. Each **major section** must be wrapped in a <section> tag with a fixed ID (see list below).
    4. If a section has multiple entries (e.g., Education, Projects), wrap each one inside <div class="entry">.
    5. Use <ul><li>...</li></ul> for bullet points.
    6. Do not include explanations, markdown, or comments — return clean, valid HTML only.
    7. All tags must be properly closed and well-indented.
    8. All section headers must use semantic <h2> tags. Sub-entries may use <h3>.

    📛 FIXED SECTION IDs:
    - Name: id="resume-name"
    - Email: id="resume-email"
    - Phone: id="resume-phone"
    - LinkedIn: id="resume-linkedin"
    - Alternate Email: id="resume-mail"
    - Objective: id="resume-objective"
    - Education: id="resume-education"
    - Experience: id="resume-experience"
    - Skills: id="resume-skills"
    - Projects: id="resume-projects"
    - Certifications: id="resume-certifications"
    - Coding Exposure: id="resume-coding-exposure"
    - Extracurricular: id="resume-extracurricular"
    - Hobbies: id="resume-hobbies"

    📌 OBJECTIVE:
    - Must be a single short paragraph targeting the Job Description (45-50 words max).

    📌 EDUCATION:
    - Each entry must be inside <div class="entry">
    - Include: degree, institution (in <h3>), date (within <span>), and GPA if present.
    - Use consistent formatting: GPA: 8.16 | Date: Nov. 2022 – May 2026

    📌 EXPERIENCE:
    - Each entry must be inside <div class="entry">
    - Use an <h3> to combine Company — Role
    - A <span> below should show Location | Dates (e.g., Remote | May 2025 – Present)
    - Bullet points inside <ul><li>...</li></ul> listing achievements

    📌 SKILLS SECTION FORMAT:
    - Must use <ul> with max 6 <li> entries
    - Each line must be a **grouped category** like:
      <li><strong>Programming Languages:</strong> C++, Python, JavaScript</li>
    - Each group should contain **max 5–6 skills**, comma-separated

    📌 PROJECTS, CERTIFICATIONS:
    - Use <section id="resume-projects"> or id="resume-certifications"
    - Each entry inside <div class="entry"> with <h3 class="project-name"> or <h3 class="certi-name">
    - Add up to 3 bullet points inside <ul>

    📌 OTHER LIST SECTIONS:
    - Use <ul> under these section IDs:
      - #resume-coding-exposure
      - #resume-extracurricular
      - #resume-hobbies
    - Each point must be inside <li> (1–3 items preferred)

    🛠 IF UNFAMILIAR SECTIONS APPEAR WHICH ARE NOT LISTED ABOVE:
    - DO NOT create new section IDs.
    - Try to **intelligently merge** unfamiliar sections into the most appropriate existing one.
      For example:
      - "Awards", "Achievements" → merge into #resume-certifications or #resume-extracurricular
      - "Languages" → merge into #resume-skills
    - Only include and optimize existing sections present in the candidate's original resume.
    - Do not fabricate or add sections that are not already present.

    🚫 DO NOT:
    - Return markdown, code blocks, JSON, or explanations.
    - Use dynamic JS or external CSS files.
    - Include extra tags or branding.

    ✅ YOUR OUTPUT:
    - Valid HTML
    - Single-column layout
    - Readable font (e.g., Arial, Segoe UI)
    - Printer-friendly, PDF-compatible
    - Clean, semantic tags with correct indentation`
      }
    ];

    const client = ModelClient(endpoint, new AzureKeyCredential(token));

    const response = await client.path("/chat/completions").post({
      body: {
        model,
        messages,
        temperature: 0.5,
        top_p: 1.0,
      }
    });

    // Check for error
    if (isUnexpected(response)) {
      throw response.body.error;
    }

    // ✅ Extract rate limit headers
    const headers = response.headers;
    const remaining = headers["x-ratelimit-remaining"];
    const limit = headers["x-ratelimit-limit"];
    const reset = headers["x-ratelimit-reset"];

    console.log(`🧠 Usage: ${remaining}/${limit} requests remaining.`);
    if (reset) {
      const resetTime = new Date(parseInt(reset) * 1000);
      console.log(`🔁 Rate limit resets at: ${resetTime.toUTCString()}`);
    }

    // Handle response content
    const output = response.body.choices[0].message.content;
    try{
      // console.log(output);  
      resumeFileName = `resumeAI_${uuidv4()}.html`;
      resumeFilePath = path.join(__dirname, '../Resources', resumeFileName);
      fs.writeFileSync(resumeFilePath, output, 'utf8');
    }catch (err) {
      throw new Error("Error writing the AI generated resume to file: " + err.message);
    }
    
  } catch (err) {
    console.error("❌ Error generating response:", err.message);
    throw new Error("Error generating response from OpenAI API: " + err.message);
  }

  return resumeFilePath; // Return the file path of the generated HTML resume
};

module.exports = { ResumeParsing };
