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

// This function processes the raw HTML resume and extracts structured data into a final HTML format.
// It uses Cheerio to parse the HTML and extract relevant sections like name, contact info,
// objective, education, experience, skills, projects, certifications, coding exposure, extracurricular activities, and hobbies.
// The Function takes in file path generate by the AI and at last a new final .html file path is returned.

function rawHtmlToFinal(resumeAIFilePath) {
  const html = fs.readFileSync(resumeAIFilePath, 'utf8');
  fs.unlinkSync(resumeAIFilePath);
  if(!html){
    throw new Error("The provided HTML file in the desing Pdf section is empty or does not exist.");
  }
  const $ = cheerio.load(html);

  const resumeData = {
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    mail: "",
    objective: "",
    education: [],
    experience: [],
    skills: {}, 
    projects: [],
    certifications: [],
    codingExposure: [],
    extracurricular: [],
    hobbies: []
  };

  extractData($, resumeData);

  const $new = cheerio.load(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title><style>${css}</style></head><body></body></html>`);
  const body = $new('body');

  const appendSection = (id, title, content) => {
    if (!content || (Array.isArray(content) && content.length === 0)) return;
    const section = $new(`<section id="${id}"><h2>${title}</h2></section>`);
    section.append(content);
    body.append(section);
  };

  const header = $new('<div id="resume-header"></div>');
  if (resumeData.name) header.append(`<section id="resume-name"><h1>${resumeData.name}</h1></section>`);
  const contact = $new('<div id="resume-contact"></div>');
  if (resumeData.email) contact.append(`<section id="resume-email"><div>${resumeData.email}</div></section>`);
  if (resumeData.phone) contact.append(`<section id="resume-phone"><div>${resumeData.phone}</div></section>`);
  if (resumeData.linkedin) contact.append(`<section id="resume-linkedin"><div><a href="${resumeData.linkedin}">LinkedIn</a></div></section>`);
  if (resumeData.mail) contact.append(`<section id="resume-mail"><div>${resumeData.mail}</div></section>`);
  header.append(contact);
  body.append(header);

  appendSection('resume-objective', 'Objective', `<div>${resumeData.objective}</div>`);

  if (resumeData.education.length) {
    const html = resumeData.education.map(e => `
      <div class="entry">
        <span class="edu-degree">${e.degree}</span>,
        <span class="edu-inst">${e.institution}</span>
        <span class="edu-date">${e.date}</span>
        ${e.gpa ? `<div>GPA: ${e.gpa}</div>` : ''}
      </div>`).join('');
    appendSection('resume-education', 'Education', html);
  }

  if (Object.keys(resumeData.skills).length) {
    const html = Object.entries(resumeData.skills).map(([k, v]) => `<li><strong>${k}:</strong> ${v.join(', ')}</li>`).join('');
    appendSection('resume-skills', 'Skills', `<ul>${html}</ul>`);
  }

  if (resumeData.experience.length) {
    const html = resumeData.experience.map(e => `
      <div class="entry">
        <span class="exp-role">${e.role}</span>,
        <span class="exp-company">${e.company}</span>
        <span class="exp-date">${e.date}</span>
        <ul>${e.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>`).join('');
    appendSection('resume-experience', 'Professional Experience', html);
  }

  if (resumeData.projects.length) {
    const html = resumeData.projects.map(p => `
      <div class="entry">
        <h3 class="project-name">${p.name}</h3>
        <ul>${p.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
      </div>`).join('');
    appendSection('resume-projects', 'Projects', html);
  }

  if (resumeData.certifications.length) {
    const html = resumeData.certifications.map(c => `
      <div class="entry">
        <h3 class="certi-name">${c.name}</h3>
        <ul>${c.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>`).join('');
    appendSection('resume-certifications', 'Certifications', html);
  }

  const listSection = (id, title, items) => {
    if (!items.length) return;
    appendSection(id, title, `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`);
  };

  listSection('resume-coding-exposure', 'Coding Exposure', resumeData.codingExposure);
  listSection('resume-extracurricular', 'Extracurricular Activities', resumeData.extracurricular);
  listSection('resume-hobbies', 'Hobbies', resumeData.hobbies);

  const resumeFileName = `designResume_${uuidv4()}.html`
  const resumeFilePath = path.join(__dirname , '../Resources' , resumeFileName);
  
  fs.writeFileSync(resumeFilePath, $new.html(), 'utf8');
  
  return resumeFilePath;
}

module.exports = { rawHtmlToFinal };
