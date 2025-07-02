const cheerio = require('cheerio');
const pdf = require('../Resources/test.html');

const resumeData = {
  name: "",                   // From #resume-name
  email: "",                  // From #resume-email
  phone: "",                  // From #resume-phone
  linkedin: "",               // From #resume-linkedin
  mail: "",                   // From #resume-mail (optional alt-email)

  objective: "",              // From #resume-objective

  education: [                // From #resume-education
    {
      degree: "",
      institution: "",
      date: "",
      gpa: ""                 // Optional
    },
    // ... more entries
  ],

  experience: [               // From #resume-experience
    {
      role: "",
      company: "",
      date: "",
      points: [
        "", "", ""            // List of bullet points
      ]
    },
    // ... more entries
  ],

  skills: {                   // From #resume-skills
    // Grouped by category (max 4–5 keys)
    // Example: "programming": ["JavaScript", "Python"],
  },

  projects: [                 // From #resume-projects
    {
      name: "",
      points: [
        "", "", ""            // Max 3 points per project
      ]
    },
    // ... more projects
  ],

  certifications: [           // From #resume-certifications
    {
      name: "",
      points: [
        "", "", ""            // Max 3 points per cert
      ]
    },
    // ... more
  ],

  codingExposure: [           // From #resume-coding-exposure
    "", "", ""                // Bullet points
  ],

  extracurricular: [          // From #resume-extracurricular
    "", "", ""                // Bullet points
  ],

  hobbies: [                  // From #resume-hobbies
    "", "", ""                // Bullet points
  ]
};


const $ = cheerio.load(pdf);

// Extracting data from the HTML using Cheerio
resumeData.name = $("#resume-name").text().trim();
resumeData.email = $("#resume-email").text().trim();
resumeData.phone = $("#resume-phone").text().trim();
resumeData.linkedin = $("#resume-linkedin").text().trim();
resumeData.mail = $("#resume-mail").text().trim();  
resumeData.objective = $("#resume-objective").text().trim();

resumeData.education = [];
$("#resume-education .entry").each((i, elem) => {
  const entry = $(elem);
  resumeData.education.push({
    degree: entry.find("h3").text().trim(),
    institution: entry.find("p").text().trim(),
    date: entry.find(".date").text().trim(),
    gpa: entry.find(".gpa").text().trim() || null
  });
});