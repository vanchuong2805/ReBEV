import addUserContactDetail from '../controllers/contact/addContactController.js';
import updateContact from '../controllers/contact/updateContactController.js';
import deleteContact from '../controllers/contact/deleteContactController.js';
import getContacts from '../controllers/contact/getContactsController.js';
import getContact from '../controllers/contact/getContactController.js';
import getContactByContactId from '../controllers/contact/getContactByContactIdController.js';
import express from 'express';

const contactRouter = express.Router();

contactRouter.get('/', getContacts);
contactRouter.get('/:id', getContact);
contactRouter.get('/contact/:contactId', getContactByContactId);
contactRouter.post('/contact-details', addUserContactDetail);
contactRouter.put('/update/contact-details', updateContact);
contactRouter.patch('/:id/delete', deleteContact);

export default contactRouter;