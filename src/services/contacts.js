import { ContactsCollection } from '../db/models/Contacts.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const contactsQuery = ContactsCollection.find();
  if (filter.contactType) {
    contactsQuery.where({ contactType: filter.contactType });
  }
  if (filter.isFavourite) {
    contactsQuery.where({ isFavourite: filter.isFavourite });
  }
  const contacts = await contactsQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });
  const count = await ContactsCollection.find(contactsQuery.getFilter())
    .merge(contactsQuery)
    .countDocuments();
  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    data: contacts,
    page,
    perPage,
    totalItems: count,
    ...paginationData,
  };
};

export const getContactById = (id) => ContactsCollection.findById(id);
export const createNewContacts = async (payload) => {
  const contacts = await ContactsCollection.create(payload);
  return contacts;
};
export const deleteContact = async (id) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: id,
  });
  return contact;
};
export const patchContact = async (id, payload, options = {}) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {
      _id: id,
    },
    payload,
    { new: true, includeResultMetadata: true, ...options },
  );

  if (!rawResult || !rawResult.value) return null;
  return {
    contacts: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
