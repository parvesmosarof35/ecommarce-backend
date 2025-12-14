import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { search_query } from "./contact.constant";
import { ContactResponse, TContact } from "./contact.interface";
import contacts from "./contact.model";
import httpStatus from "http-status";

const createContactIntoDb = async (
  payload: TContact
): Promise<ContactResponse> => {
  try {
    const contactBuilder = new contacts(payload);
    const result = await contactBuilder.save();
    return { status: true, message: "successfully recorded" };
  } catch (error: any) {
    console.error("Create contact DB error:", error);
    throw new AppError(
      httpStatus.SERVICE_UNAVAILABLE,
      error.message || "createContactIntoDb section unavailable",
      ""
    );
  }
};

const all_contact_IntoDb = async (query: Record<string, unknown>) => {
  try {
    const allContactQuery = new QueryBuilder(contacts.find({}), query)
      .search(search_query)
      .filter()
      .sort()
      .paginate()
      .fields();

    const allContactList = await allContactQuery.modelQuery;
    const meta = await allContactQuery.countTotal();
    return { meta, allContactList };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed  all contact list",
      error
    );
  }
};

const specificContactIntoDb = async (id: string) => {
  try {
    return await contacts.findById(id).select("name email question");
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed specific contact Into Db",
      error
    );
  }
};

const updateContactIntoDb = async (id: string, payload: Partial<TContact>) => {
  try {
    const result = await contacts.findByIdAndUpdate(id, payload, {
      new: true,
      upsert: true,
    });
    return result && { status: true, message: "successfully updated" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed update contact Into Db",
      error
    );
  }
};

const deleteContactIntoDb = async (id: string) => {
  try {
    const result = await contacts.findByIdAndDelete(id);
    return result && { status: true, message: "successfully delete contact" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || httpStatus.SERVICE_UNAVAILABLE,
      error.message || "Failed delete contact Into Db",
      error
    );
  }
};

const contactController = {
  createContactIntoDb,
  all_contact_IntoDb,
  specificContactIntoDb,
  updateContactIntoDb,
  deleteContactIntoDb,
};

export default contactController;
