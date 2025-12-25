const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const validatePhone = (phone) => {
  return phone && phone.length >= 10;
};

const validateRequired = (fields) => {
  return fields.every(field => field && field.toString().trim() !== '');
};

module.exports = {
  validateEmail,
  validatePhone,
  validateRequired
};