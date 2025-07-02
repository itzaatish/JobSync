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

      Your job is to rewrite and optimize resumes using only the candidate’s data (do not invent or exaggerate) and structure it in clean HTML with strict formatting rules, so it can be parsed in the backend.`,
        },
        {
          role: "user",
          content:
            `Here is the job description:\n${jobDescription}\n\n` +
            `Here is the candidate's resume:\n${resumeContent}\n\n` +

            `⚠️ Follow the instructions **strictly**:\n\n` +

            `📦 HTML STRUCTURE RULES:\n` +
            `1. Wrap the entire content in a complete <html> document with <head> and <body>.\n` +
            `2. Add <style> inside <head> with basic formatting.\n` +
            `3. Each major section must be wrapped in a <section> with a fixed ID (listed below).\n` +
            `4. If a section has **multiple entries**, each entry must be inside <div class="entry">.\n` +
            `5. If entries contain points (like project tasks), wrap them in <ul><li>...</li></ul>.\n` +
            `6. Do NOT add explanations, markdown, or comments — return pure valid HTML only.\n\n` +

            `📛 SECTION IDs TO USE:\n` +
            `- Name: id="resume-name"\n` +
            `- Email: id="resume-email"\n` +
            `- Phone: id="resume-phone"\n` +
            `- LinkedIn: id="resume-linkedin"\n` +
            `- Mail (alternate): id="resume-mail"\n` +
            `- Objective (summary): id="resume-objective"\n` +
            `- Education: id="resume-education"\n` +
            `- Experience: id="resume-experience"\n` +
            `- Skills: id="resume-skills"\n` +
            `- Projects: id="resume-projects"\n` +
            `- Certifications: id="resume-certifications"\n` +
            `- Coding Exposure: id="resume-coding-exposure"\n` +
            `- Extracurricular: id="resume-extracurricular"\n` +
            `- Hobbies: id="resume-hobbies"\n\n` +

            `📌 STRUCTURE EXAMPLE FOR A MULTI-ENTRY SECTION:\n` +
            `<section id="resume-projects">\n` +
            `  <h2>Projects</h2>\n` +
            `  <div class="entry">\n` +
            `    <h3 class="project-name">AI Resume Builder</h3>\n` +
            `    <ul>\n` +
            `      <li>Integrated OpenAI for tailored resume generation</li>\n` +
            `      <li>Used Puppeteer to convert HTML to PDF</li>\n` +
            `    </ul>\n` +
            `  </div>\n` +
            `</section>\n\n` +

            `📌 STRUCTURE EXAMPLE FOR SKILLS (MAX 5 GROUPS):\n` +
            `<section id="resume-skills">\n` +
            `  <h2>Skills</h2>\n` +
            `  <ul>\n` +
            `    <li><strong>Programming Languages:</strong> C++, Python, JavaScript, C</li>\n` +
            `    <li><strong>Web Development:</strong> HTML5, CSS, React.js, Node.js, Express.js</li>\n` +
            `    <li><strong>Databases:</strong> PostgreSQL, MongoDB</li>\n` +
            `    <li><strong>Version Control & Tools:</strong> GitHub, Prisma</li>\n` +
            `    <li><strong>Microcontroller/Simulation:</strong> Arduino, MATLAB, Simulink</li>\n` +
            `  </ul>\n` +
            `</section>\n\n` +

            `📝 ADDITIONAL REQUIREMENTS:\n` +
            `- The summary/objective must be 25–30 words max.\n` +
            `- Group and limit skills to 4 or 5 categories — prioritize relevant skills from the job description.\n` +
            `- Keep the layout single-column, minimal, and printer/PDF-friendly.\n` +
            `- Use semantic HTML and ensure every tag is properly closed.\n\n` +

            `Return the complete HTML resume only — no markdown or explanation.`
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
