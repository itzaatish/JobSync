const ModelClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");
const dotenv = require("dotenv");
const { data } = require("../Resources/localDB");
const { pdfGeneratorFromHtml } = require("./pdf_generator_from_html");

dotenv.config();

const endpoint = "https://models.github.ai/inference"; // Replace with your actual endpoint if needed
const model = "openai/gpt-4.1"; // Don't change unless instructed
const token = process.env.GPT_API_KEY;

const promptGeneration = async (req, res) => {
  try {
    const resumeContent = data.resume;
    const jobDescription = data.discription;

    const messages = [
      {
        role: "system",
        content: `You are a professional resume writer and career consultant with deep knowledge of applicant tracking systems (ATS), keyword optimization, and clean HTML formatting.

    Your task is to rewrite and optimize resumes using only the candidate’s data. Do not fabricate, exaggerate, or invent content. Return the result as valid HTML with inline CSS, structured strictly for easy parsing by automated systems.`,
      },
      {
        role: "user",
        content:
    `Here is the job description:\n${jobDescription}\n\n
    Here is the candidate's resume:\n${resumeContent}\n\n

    ⚠️ STRICT INSTRUCTIONS:

    📦 HTML STRUCTURE RULES:
    1. Wrap everything inside a valid <html> document with <head> and <body>.
    2. Use <style> inside <head> for inline styling (no external files).
    3. Each section must be wrapped inside <section> with fixed IDs listed below.
    4. Each multi-entry block (like Education, Experience) must use <div class="entry"> for each item.
    5. Use <ul><li>...</li></ul> for bullet points inside entries.
    6. Ensure clean, minimal, single-column formatting — suitable for PDF rendering.
    7. Avoid adding explanations, comments, or extra tags.

    📛 SECTION IDs TO USE:
    - Full Name: id="resume-name"
    - Email: id="resume-email"
    - Phone: id="resume-phone"
    - LinkedIn: id="resume-linkedin"
    - Alternate Email: id="resume-mail"
    - Objective (summary): id="resume-objective"
    - Education: id="resume-education"
    - Experience: id="resume-experience"
    - Skills: id="resume-skills"
    - Projects: id="resume-projects"
    - Certifications: id="resume-certifications"
    - Coding Exposure: id="resume-coding-exposure"
    - Extracurricular: id="resume-extracurricular"
    - Hobbies: id="resume-hobbies"

    📌 SKILLS SECTION RULES:
    - Use grouped bullet list format:
      <li><strong>Category Name:</strong> Skill1, Skill2, Skill3</li>
    - Limit to max 6 categories only if necessary.
    - Each category must not exceed 5–6 items.
    - Prioritize groupings based on the job description.

    📌 MULTI-ENTRY EXAMPLE:
    <section id="resume-projects">
      <h2>Projects</h2>
      <div class="entry">
        <h3 class="project-name">AI Resume Builder</h3>
        <ul>
          <li>Integrated OpenAI for tailored resume generation</li>
          <li>Used Puppeteer to convert HTML to PDF</li>
        </ul>
      </div>
    </section>

    📌 SKILLS EXAMPLE:
    <section id="resume-skills">
      <h2>Skills</h2>
      <ul>
        <li><strong>Programming Languages:</strong> C++, Python, JavaScript</li>
        <li><strong>Web Development:</strong> HTML5, CSS, React, Node.js</li>
        <li><strong>Databases:</strong> PostgreSQL, MongoDB</li>
        <li><strong>Version Control:</strong> GitHub, GitLab</li>
        <li><strong>Simulation Tools:</strong> MATLAB, Simulink</li>
      </ul>
    </section>

    📝 FINAL NOTES:
    - The objective/summary must not exceed 30 words.
    - If the resume includes any unknown/new section, try your best to fit it into one of the above listed IDs.
    - All section headers (h2) should follow semantic structure.
    - Every tag must be properly closed.
    - Return **valid HTML only**. No markdown. No commentary. No explanation.`
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
      res.status(200).json({ html: output });
      console.log("Generated HTML:", output);
      console.log("✅ Resume generated successfully.");
    }catch (err) {
      console.error("❌ Error parsing response content:", err.message);
      throw new Error("Failed to parse response content");
    }
    
  } catch (err) {
    console.error("❌ Error generating resume:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { promptGeneration };
