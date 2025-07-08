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
  resumeData.mail = $('#resume-mail').text().trim();
  resumeData.objective = $('#resume-objective').text().replace('Objective', '').trim();

  $('#resume-education .entry').each((i, elem) => {
    const entry = $(elem);
    const allSpans = entry.find('span').map((i, el) => $(el).text().trim()).get();
    resumeData.education.push({
      degree: allSpans[0] || '',
      institution: entry.find('h3').text().trim() || '',
      date: allSpans[1]?.split('|')[1]?.trim() || '',
      gpa: allSpans[1]?.includes('GPA') ? allSpans[1].match(/GPA[:\s]*([\d.]+)/)?.[1] : null
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
    (Array.isArray(content) && content.length === 0)
  ) return;

  const section = $new(`<section id="${id}"></section>`);
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

  appendSection('resume-objective', 'Objective', `<div>${resumeData.objective}</div>`);

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

  const extracurHTML = resumeData.extracurricular.map(item => `<li>${item}</li>`).join('');
  appendSection('resume-extracurricular', 'Extracurricular Activities', `<ul>${extracurHTML}</ul>`);

  const codingHTML = resumeData.codingExposure.map(item => `<li>${item}</li>`).join('');
  appendSection('resume-coding-exposure', 'Coding Exposure', `<ul>${codingHTML}</ul>`);

  const hobbiesHTML = resumeData.hobbies.map(item => `<li>${item}</li>`).join('');
  appendSection('resume-hobbies', 'Hobbies', `<ul>${hobbiesHTML}</ul>`);

  const finalPath = path.join(__dirname, '../Resources', `final_resume_${uuidv4()}.html`);
  fs.writeFileSync(finalPath, $new.html(), 'utf8');

  return finalPath;
}

module.exports = { rawHtmlToFinal };
