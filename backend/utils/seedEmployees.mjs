import Employee from '../models/Employee.mjs';
import { encrypt } from '../utils/encryption.mjs';

const employees = [
  {
    firstName: 'Samantha',
    lastName: 'Jones',
    email: 'samantha.jones@paysmart.com',
    password: 'SamanthaJones!23',
    role: 'employee',
  },
];

export const seedEmployees = async () => {
  try {
    for (const emp of employees) {
      // Encrypt email before checking existence
      const encryptedEmail = encrypt(emp.email.toLowerCase());
      const exists = await Employee.findOne({ email: encryptedEmail });

      if (!exists) {
        // Triggers pre-save hook for encryption & hashing
        await Employee.create(emp); 
        console.log(`Seeded employee: ${emp.email}`);
      } else {
        console.log(`Employee already exists: ${emp.email}`);
      }
    }

    console.log('Employee seeding completed.');
  } catch (error) {
    console.error('Error seeding employees:', error);
  }
};

//-------------------------------------------------------------------End of File----------------------------------------------------------//