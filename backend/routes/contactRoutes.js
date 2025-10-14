import addUserContactDetail from '../controllers/user/addContactController.js';
import updateContact from '../controllers/user/updateContactController.js';
import deleteContact from '../controllers/user/deleteContactController.js';
import getContacts from '../controllers/user/getContactsController.js';
import getContact from '../controllers/user/getContactController.js';
import express from 'express';

const contactRouter = express.Router();

contactRouter.post('/contact-details', addUserContactDetail);
contactRouter.put('/update/contact-details', updateContact);
contactRouter.patch('/:id/delete', deleteContact);
contactRouter.get('/', getContacts);
contactRouter.get('/:id', getContact);

export default contactRouter;