import { NextFunction, Response } from "express";
import { UserRequest } from "../type/userRequest";
import {
  CreateAddressRequest,
  GetAddressRequest,
  RemoveAddressRequest,
  UpdateAddressRequest
} from "../models/addressModel";
import { AddressService } from "../services/addressService";

export class AddressController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateAddressRequest = req.body as CreateAddressRequest;
      request.contact_id = req.params.contactId;

      const response = await AddressService.create(req.user!, request);
      res.status(200).json({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: GetAddressRequest = {
        id: req.params.addressId,
        contact_id: req.params.contactId
      };

      const response = await AddressService.get(req.user!, request);
      res.status(200).json({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateAddressRequest = req.body as UpdateAddressRequest;
      request.contact_id = req.params.contactId;
      request.id = req.params.addressId;

      const response = await AddressService.update(req.user!, request);
      res.status(200).json({
        data: response
      });
    } catch (e) {
      next(e);
    }
  }

  static async remove(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: RemoveAddressRequest = {
        id: req.params.addressId,
        contact_id: req.params.contactId
      };

      await AddressService.remove(req.user!, request);
      res.status(200).json({
        data: "OK"
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = req.params.contactId;
      const response = await AddressService.list(req.user!, contactId);
      res.status(200).json({
        data: response
      });
    } catch (e) {
      next(e);
    }
  }
}
