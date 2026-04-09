const bcrypt = require('bcryptjs');

const plainPassword = 'water123'; // The password you want to use

async function hashPassword() {
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log('Hashed password:', hashedPassword);
  console.log('\nUpdate your user record in Prisma Studio:');
  console.log('Replace the password field with this value above');
}

hashPassword();
