import { Address, User } from "@prisma/client";
import {
  AddressResponse,
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  toAddressResponse,
  UpdateAddressRequest
} from "../models/addressModel";
import { Validation } from "../validations/validation";
import { AddressValidation } from "../validations/addressValidation";
import { ContactService } from "./contactService";
import { prismaClient } from "../applications/database";
import { ResponseError } from "../error/responseError";

export class AddressService {
  static async create(
    user: User,
    request: CreateAddressRequest
  ): Promise<AddressResponse> {
    const createRequest = Validation.validate(
      AddressValidation.CREATE,
      request
    );
    await ContactService.checkContactExists(user, createRequest.contact_id);
    const address = await prismaClient.address.create({
      data: createRequest
    });
    return toAddressResponse(address);
  }

  static async checkAddressMustExists(
    contactId: string,
    addressId: string
  ): Promise<Address> {
    const address = await prismaClient.address.findFirst({
      where: {
        id: addressId,
        contact_id: contactId
      }
    });

    if (!address) {
      throw new ResponseError(404, "Address is not found");
    }

    return address;
  }

  static async get(
    user: User,
    request: GetAddressRequest
  ): Promise<AddressResponse> {
    const getRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactExists(user, request.contact_id);
    const address = await this.checkAddressMustExists(
      getRequest.contact_id,
      getRequest.id
    );

    return toAddressResponse(address);
  }

  static async update(
    user: User,
    request: UpdateAddressRequest
  ): Promise<AddressResponse> {
    const updateRequest = Validation.validate(
      AddressValidation.UPDATE,
      request
    );
    await ContactService.checkContactExists(user, request.contact_id);
    await this.checkAddressMustExists(
      updateRequest.contact_id,
      updateRequest.id
    );

    const address = await prismaClient.address.update({
      where: {
        id: updateRequest.id,
        contact_id: updateRequest.contact_id
      },
      data: updateRequest
    });

    return toAddressResponse(address);
  }

  static async remove(
    user: User,
    request: RemoveAddressRequest
  ): Promise<AddressResponse> {
    const removeRequest = Validation.validate(AddressValidation.GET, request);
    await ContactService.checkContactExists(user, request.contact_id);
    await this.checkAddressMustExists(
      removeRequest.contact_id,
      removeRequest.id
    );

    const address = await prismaClient.address.delete({
      where: {
        id: removeRequest.id
      }
    });

    return toAddressResponse(address);
  }

  static async list(
    user: User,
    contactId: string
  ): Promise<Array<AddressResponse>> {
    await ContactService.checkContactExists(user, contactId);

    const addresses = await prismaClient.address.findMany({
      where: {
        contact_id: contactId
      }
    });

    return addresses.map((address) => toAddressResponse(address));
  }
}
