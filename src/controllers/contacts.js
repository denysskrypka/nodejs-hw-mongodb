import * as contactsServices from '../services/contacts.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  const data = await contactsServices.getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await contactsServices.getContactById(contactId);
  if (!data) {
    next(createHttpError(404, `Contact with id=${contactId} not found`));
    return;
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
};

export const createNewContactController = async (req, res) => {
  const data = await contactsServices.createNewContacts(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const data = await contactsServices.deleteContact(contactId);
  console.log(data);
  if (!data) {
    next(createHttpError(404, `Contact with id=${contactId} not found`));
    return;
  }
  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await contactsServices.patchContact(contactId, req.body);
  if (!result) {
    next(createHttpError(404, `Contact with id=${contactId} not found`));
    return;
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: result.contacts,
  });
};