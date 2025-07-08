const axios = require('axios');
const { faker } = require('@faker-js/faker');

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjo3LCJ1c2VySWQiOiJhNzk4ZmFmZi0xMzEyLTQwZDItODRlYS1lZWFiMGUwYWQ5MjIiLCJpYXQiOjE3NTE4ODQxMDEsImV4cCI6MTc1MjA1NjkwMX0.EW7NU58g6PZsUE0nertbCMMJSR4qM0nVizSdQGCX61o"; // Replace this with your real token
const url = "http://localhost:2000/create_application";

const seedApplications = async () => {
  for (let i = 0; i < 25; i++) {
    const applicationData = {
      CompanyName: faker.company.name(),
      JobTitle: faker.person.jobTitle(),
      ResumeUsed: `Resume_${faker.number.int({ min: 1, max: 5 })}`,
      CoverLetterUsed: `CoverLetter_${faker.number.int({ min: 1, max: 5 })}`,
      Status: faker.helpers.arrayElement(['APPLIED', 'INTERVIEW', 'REJECTED', 'OFFER']),
      ApplicationDate: faker.date.recent().toISOString(),
      PersonalNotes: faker.lorem.sentence()
    };

    try {
      const res = await axios.post(url, applicationData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log(`✅ Application ${i + 1} created`, res.data.newApplication.application_id);
    } catch (err) {
      console.error(`❌ Error creating application ${i + 1}:`, err.message);
    }
  }
};

seedApplications();
