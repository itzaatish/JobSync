const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const cssPath = path.join(__dirname, 'pdf_design.css');
const css = fs.readFileSync(cssPath, 'utf8');

const extractData = ($, resumeData) => {
  resumeData.name = $('#resume-name').text().trim();
  resumeData.email = $('#resume-email').text().trim();
  resumeData.phone = $('#resume-phone').text().trim();
  resumeData.linkedin = $('#resume-linkedin').text().trim();
  // resumeData.mail = $('#resume-mail').text().trim();
  resumeData.objective = $('#resume-objective').text().replace('Objective', '').trim();

  $('#resume-education .entry').each((i, elem) => {
    const entry = $(elem);
    const h3Text = entry.find('h3').text().trim();
    const spanText = entry.find('span').text().trim();

    // Extract GPA and date from spanText
    const gpaMatch = spanText.match(/GPA[:\s]*([\d.]+)/);
    const dateMatch = spanText.match(/Date[:\s]*(.+)/);

    // If GPA and Date are present in one span with "|", split and parse
    let gpa = null;
    let date = '';
    if (spanText.includes('|')) {
        const parts = spanText.split('|').map(s => s.trim());
        parts.forEach(p => {
          if (p.toLowerCase().includes('gpa')) {
            gpa = p.match(/GPA[:\s]*([\d.]+)/)?.[1] || null;
          } else if (p.toLowerCase().includes('date')) {
            date = p.replace(/Date[:\s]*/i, '');
          } else if (/\d{4}/.test(p)) {
            date = p; // fallback if "Date:" is not written
          }
        });
      } else {
        gpa = gpaMatch ? gpaMatch[1] : null;
        date = dateMatch ? dateMatch[1].trim() : spanText;
    }

    resumeData.education.push({
      degree: h3Text.split('–')[0].trim(),
      institution: h3Text.includes('–') ? h3Text.split('–')[1].trim() : '',
      date,
      gpa
    });
  });


  $('#resume-experience .entry').each((i, elem) => {
    const entry = $(elem);
    const header = entry.find('h3').text().trim();
    const meta = entry.find('span').first().text().trim();
    const [company, role] = header.split('—').map(t => t.trim());
    resumeData.experience.push({
      role: role || '',
      company: company || '',
      date: meta,
      points: entry.find('ul li').map((i, li) => $(li).text().trim()).get()
    });
  });

  $('#resume-skills ul li').each((i, li) => {
    const line = $(li).text().trim();
    const [category, skillsList] = line.split(':');
    if (category && skillsList) {
      resumeData.skills[category.trim()] = skillsList.split(',').map(s => s.trim());
    }
  });

  $('#resume-projects .entry').each((i, elem) => {
    const entry = $(elem);
    resumeData.projects.push({
      name: entry.find('.project-name').text().trim(),
      points: entry.find('ul li').map((i, li) => $(li).text().trim()).get()
    });
  });

  $('#resume-certifications .entry').each((i, elem) => {
    const entry = $(elem);
    resumeData.certifications.push({
      name: entry.find('.certi-name').text().trim(),
      points: entry.find('ul li').map((i, li) => $(li).text().trim()).get()
    });
  });

  $('#resume-coding-exposure ul li').each((i, li) => {
    resumeData.codingExposure.push($(li).text().trim());
  });

  $('#resume-extracurricular ul li').each((i, li) => {
    resumeData.extracurricular.push($(li).text().trim());
  });

  $('#resume-hobbies ul li').each((i, li) => {
    resumeData.hobbies.push($(li).text().trim());
  });

  return resumeData;
};

// Converts raw HTML resume to a final structured HTML file
// This function reads the HTML file, extracts data using Cheerio, and formats it into a final HTML structure.
// This Function returns the path to the final HTML file.

function rawHtmlToFinal(resumeAIFilePath) {
  // console.log("Raw HTML File Path:", resumeAIFilePath);
  const html = fs.readFileSync(resumeAIFilePath, 'utf8');
  fs.unlinkSync(resumeAIFilePath);
  if (!html) throw new Error("The provided HTML is empty.");

  const $ = cheerio.load(html);

  // ✅ Initialize and extract
  const resumeData = {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    mail: '',
    objective: '',
    education: [],
    experience: [],
    skills: {},
    projects: [],
    certifications: [],
    codingExposure: [],
    extracurricular: [],
    hobbies: []
  };
  extractData($, resumeData); // ✅ Call the parser properly
  // console.log("Resume Data Extracted:", resumeData);
  // ✅ Inline CSS instead of linking (Puppeteer won't follow href reliably)
  const $new = cheerio.load(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${resumeData.name} - Resume</title>
      <style>${css}</style>
    </head>
    <body></body>
    </html>
  `);
  const body = $new('body');

  const appendSection = (id, title, content, className = "header") => {
    if (
      !content ||
      (typeof content === 'string' && content.trim() === '') ||
      (Array.isArray(content) && content.length === 0) ||
      (typeof content === 'object' && typeof content.children === 'function' && content.children().length === 0) ||
      (typeof content === 'object' && content.html && content.html().trim() === '')
    ) return;

    const section = $new(`<section id="${id}"></section>`);
    // console.log(`Appending section: ${id} with title: ${title}`);
    section.append(`<h2 class="${className}">${title}</h2>`);
    section.append(content);
    body.append(section);
  };



  const header = $new('<div id="resume-header" class="header"></div>');
  header.append(`<section id="resume-name"><h1>${resumeData.name}</h1></section>`);
  const contact = $new('<div id="resume-contact"></div>');
  if (resumeData.email) contact.append(`<section id="resume-email"><div>${resumeData.email}</div></section>`);
  if (resumeData.phone) contact.append(`<section id="resume-phone"><div>${resumeData.phone}</div></section>`);
  if (resumeData.linkedin) contact.append(`<section id="resume-linkedin"><div><a href="${resumeData.linkedin}">LinkedIn</a></div></section>`);
  if (resumeData.mail) contact.append(`<section id="resume-mail"><div>${resumeData.mail}</div></section>`);
  header.append(contact);
  body.append(header);

  // appendSection('resume-objective', 'Objective', `<div>${resumeData.objective}</div>`);

  const eduHTML = resumeData.education.map(e => `
    <div class="entry">
      <span class="edu-degree">${e.degree}</span>,
      <span class="edu-inst">${e.institution}</span>
      <span class="edu-date">${e.date}</span>
      ${e.gpa ? `<div>GPA: ${e.gpa}</div>` : ''}
    </div>`).join('');
  appendSection('resume-education', 'Education', eduHTML);

  const skillsHTML = Object.entries(resumeData.skills).map(([k, v]) => `<li><strong>${k}:</strong> ${v.join(', ')}</li>`).join('');
  appendSection('resume-skills', 'Skills', `<ul>${skillsHTML}</ul>`);

  const expHTML = resumeData.experience.map(e => `
    <div class="entry">
      <span class="exp-role">${e.role}</span>,
      <span class="exp-company">${e.company}</span>
      <span class="exp-date">${e.date}</span>
      <ul>${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>`).join('');
  appendSection('resume-experience', 'Professional Experience', expHTML);

  const projHTML = resumeData.projects.map(p => `
    <div class="entry">
      <h3 class="project-name">${p.name}</h3>
      <ul>${p.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
    </div>`).join('');
  appendSection('resume-projects', 'Projects', projHTML);

  const certHTML = resumeData.certifications.map(c => `
    <div class="entry">
      <h3 class="certi-name">${c.name}</h3>
      <ul>${c.points.map(p => `<li>${p}</li>`).join('')}</ul>
    </div>`).join('');
  appendSection('resume-certifications', 'Certifications', certHTML);

    if (resumeData.extracurricular && resumeData.extracurricular.length > 0) {
      const extracurHTML = resumeData.extracurricular.map(item => `<li>${item}</li>`).join('');
      appendSection('resume-extracurricular', 'Extracurricular Activities', `<ul>${extracurHTML}</ul>`);
    }

  if (resumeData.codingExposure && resumeData.codingExposure.length > 0) {
      const codingHTML = resumeData.codingExposure.map(item => `<li>${item}</li>`).join('');
      appendSection('resume-coding-exposure', 'Coding Exposure', `<ul>${codingHTML}</ul>`);
    }

  if (resumeData.hobbies && resumeData.hobbies.length > 0) {
      const hobbiesHTML = resumeData.hobbies.map(item => `<li>${item}</li>`).join('');
      appendSection('resume-hobbies', 'Hobbies', `<ul>${hobbiesHTML}</ul>`);
    }

  const finalPath = path.join(__dirname, '../Resources', `final_resume_${uuidv4()}.html`);
  fs.writeFileSync(finalPath, $new.html(), 'utf8');

  return finalPath;
}

// const filename = path.join(__dirname, `../ResumeFormat.html`);
// console.log("Final HTML File Path:", filename);
// rawHtmlToFinal(filename); // Example usage, replace with actual path`);

module.exports = {
  rawHtmlToFinal,
}

