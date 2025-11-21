import checkResetToken from './functions/checkResetToken.js';
import confirmEmailAddress from './functions/confirmEmailAddress.js';
import createUser from './functions/createUser.js';
import forgotPassword from './functions/forgotPassword.js';
import generatePasswordResetToken from './functions/generatePasswordResetToken.js';
import getUserByEmail from './functions/getUserByEmail.js';
import getUserByIdAndEmail from './functions/getUserByIdAndEmail.js';
import getUsers from './functions/getUsers.js';
import resetPassword from './functions/resetPassword.js';
import sendWelcomeEmail from './functions/sendWelcomeEmail.js';
import updateUser from './functions/updateUser.js';
import validatePassword from './functions/validatePassword.js';

export default {
	checkResetToken,
	confirmEmailAddress,
	createUser,
	forgotPassword,
	generatePasswordResetToken,
	getUserByIdAndEmail,
	getUserByEmail,
	getUsers,
	resetPassword,
	sendWelcomeEmail,
	updateUser,
	validatePassword,
};
