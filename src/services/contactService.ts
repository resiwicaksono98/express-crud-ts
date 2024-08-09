import { User } from "@prisma/client";
import {
  ContactResponse,
  CreateContactRequest,
  toContactResponse,
  UpdateContactRequest
} from "../models/contactModel";
import { ContactValidation } from "../validations/contactValidation";
import { Validation } from "../validations/validation";
import { prismaClient } from "../applications/database";
import { logger } from "../applications/logging";
import { ResponseError } from "../error/responseError";
import { UserValidation } from "../validations/userValidation";
import { SearchContactRequest } from "../models/userModel";

export class ContactService {
  static async create(
    user: User,
    request: CreateContactRequest
  ): Promise<ContactResponse> {
    const createRequest = Validation.validate(
      ContactValidation.CREATE,
      request
    );

    const record = {
      ...createRequest,
      ...{ username: user.username }
    };

    const contact = await prismaClient.contact.create({
      data: record
    });

    return toContactResponse(contact);
  }

  static async checkContactExists(user: User, contactId: string) {
    const contact = await prismaClient.contact.findFirst({
      where: {
        id: contactId,
        username: user.username
      }
    });

    if (!contact) {
      throw new ResponseError(404, "Contact not found");
    }

    return contact;
  }

  static async get(user: User, id: string): Promise<ContactResponse> {
    const contact = await this.checkContactExists(user, id);

    return toContactResponse(contact);
  }

  static async update(
    user: User,
    request: UpdateContactRequest
  ): Promise<ContactResponse> {
    const updateRequest = Validation.validate(
      ContactValidation.UPDATE,
      request
    );
    await this.checkContactExists(user, updateRequest.id);

    const contact = await prismaClient.contact.update({
      where: {
        id: updateRequest.id,
        username: user.username
      },
      data: updateRequest
    });
    return toContactResponse(contact);
  }

  static async delete(user: User, id: string) {
    await this.checkContactExists(user, id);

    const contact = await prismaClient.contact.delete({
      where: {
        id,
        username: user.username
      }
    });

    return toContactResponse(contact);
  }

  static async search(
    user: User,
    request: SearchContactRequest
  ): Promise<Pageable<ContactResponse>> {
    const searchRequest = Validation.validate(
      ContactValidation.SEARCH,
      request
    );
    const filters = [];

    if (searchRequest.name) {
      filters.push({
        OR: [
          {
            first_name: {
              contains: searchRequest.name
            }
          },
          {
            last_name: {
              contains: searchRequest.name
            }
          }
        ]
      });
    }

    if (searchRequest.email) {
      filters.push({
        email: {
          contains: searchRequest.email
        }
      });
    }

    if (searchRequest.phone) {
      filters.push({
        phone: {
          contains: searchRequest.phone
        }
      });
    }

    const contacts = await prismaClient.contact.findMany({
      where: {
        username: user.username,
        AND: filters
      },
      take: searchRequest.page,
      skip: searchRequest.perPage * (searchRequest.page - 1)
    });

    const total = await prismaClient.contact.count({
      where: {
        username: user.username,
        AND: filters
      }
    });

    return {
      data: contacts.map((contact) => toContactResponse(contact)),
      paging: {
        page: searchRequest.page,
        perPage: searchRequest.perPage,
        totalPages: Math.ceil(total / searchRequest.perPage)
      }
    };
  }
}
