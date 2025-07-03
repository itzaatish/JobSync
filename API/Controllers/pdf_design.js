const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '../Resources', 'test.html'); // Adjust the path if needed
const html = fs.readFileSync(htmlPath, 'utf8'); // Read the HTML file

const $ = cheerio.load(html);

const resumeData = {
  name: $('#resume-name').text().trim(),
  email: $('#resume-email').text().trim(),
  phone: $('#resume-phone').text().trim(),
  linkedin: $('#resume-linkedin').text().trim(),
  mail: $('#resume-mail').text().trim(),
  objective: $('#resume-objective').text().replace('Objective', '').trim(),

  education: [],
  experience: [],
  skills: {},
  projects: [],
  certifications: [],
  codingExposure: [],
  extracurricular: [],
  hobbies: []
};

// Education
$('#resume-education .entry').each((i, elem) => {
  const entry = $(elem);
  resumeData.education.push({
    degree: entry.find(".edu-degree").text().trim(),
    institution: entry.find(".edu-inst").text().trim(),
    date: entry.find(".edu-date").text().trim(),
    gpa: entry.text().includes("GPA") ? entry.find('div').text().replace(/GPA[:\s]*/, '').trim() : null
  });
});

// Experience
$('#resume-experience .entry').each((i, elem) => {
  const entry = $(elem);
  resumeData.experience.push({
    role: entry.find(".exp-role").text().trim(),
    company: entry.find(".exp-company").text().trim(),
    date: entry.find(".exp-date").text().trim(),
    points: entry.find('ul li').map((i, li) => $(li).text().trim()).get()
  });
});

// Skills
$('#resume-skills ul li').each((i, li) => {
  const line = $(li).text().trim();
  const [category, skillsList] = line.split(':');
  if (category && skillsList) {
    resumeData.skills[category.trim()] = skillsList.split(',').map(s => s.trim());
  }
});

// Projects
$('#resume-projects .entry').each((i, elem) => {
  const entry = $(elem);
  resumeData.projects.push({
    name: entry.find('.project-name').text().trim(),
    points: entry.find('ul li').map((i, li) => $(li).text().trim()).get()
  });
});

// Certifications
$('#resume-certifications .entry').each((i, elem) => {
  const entry = $(elem);
  resumeData.certifications.push({
    name: entry.find('.certi-name').text().trim(),
    points: entry.find('ul li').map((i, li) => $(li).text().trim()).get()
  });
});

// Coding Exposure
$('#resume-coding-exposure ul li').each((i, li) => {
  resumeData.codingExposure.push($(li).text().trim());
});

// Extracurricular
$('#resume-extracurricular ul li').each((i, li) => {
  resumeData.extracurricular.push($(li).text().trim());
});

// Hobbies
$('#resume-hobbies ul li').each((i, li) => {
  resumeData.hobbies.push($(li).text().trim());
});

console.log(resumeData);

// now we have to make a function which will use this data to make a new resume 
