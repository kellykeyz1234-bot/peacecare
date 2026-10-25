require('dotenv').config();
const { sequelize } = require('./config/db');
const { User } = require('./models'); // also loads all models + associations

// Emails must be lowercase, because login lowercases whatever is typed
const SEED_USERS = [
  {
    name: 'PeaceCare Admin',
    email: 'admin@peacecare.com',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin',
  },
  {
    name: 'Akua Owusu',
    email: 'doctor@peacecare.com',
    password: process.env.SEED_DOCTOR_PASSWORD || 'Doctor@12345',
    role: 'doctor',
    specialization: 'General Physician',
    phone: '024 000 1111',
    gender: 'female',
  },
  {
    name: 'Helen Mensah',
    email: 'patient@peacecare.com',
    password: process.env.SEED_PATIENT_PASSWORD || 'Patient@12345',
    role: 'patient',
    phone: '050 000 2222',
    dateOfBirth: '1998-05-14',
    gender: 'female',
  },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates missing tables, never drops anything

    for (const data of SEED_USERS) {
      const existing = await User.findOne({ where: { email: data.email } });
      if (existing) {
        console.log(`Skipped (already exists): ${data.email}`);
        continue;
      }
      await User.create(data); // the beforeSave hook hashes the password
      console.log(`Created ${data.role}: ${data.email}`);
    }

    console.log('\nDone. Log in with the emails above and the passwords in this file.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();