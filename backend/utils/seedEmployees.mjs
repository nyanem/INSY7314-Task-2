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
    await Employee.deleteMany({});
    console.log('Deleted all employees.');

    for (const emp of employees) {
      // Create new employee — pre-save hook handles encryption & hashing
      await Employee.create({
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email.toLowerCase(),
        password: emp.password,
        role: emp.role,
      });

      console.log(`Seeded employee: ${emp.firstName} ${emp.lastName}`);
    }

    console.log('Employee seeding completed.');
  } catch (error) {
    console.error('Error seeding employees:', error);
  }
};

seedEmployees();
//-------------------------------------------------------------------End of File----------------------------------------------------------//