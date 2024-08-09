import { SearchContactRequest } from "./../models/userModel";
import { NextFunction, Response } from "express";
import { UserRequest } from "../type/userRequest";
import {
  CreateContactRequest,
  UpdateContactRequest
} from "../models/contactModel";
import { ContactService } from "../services/contactService";
import { logger } from "../applications/logging";

export class ContactController {
  static async create(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: CreateContactRequest = req.body as CreateContactRequest;
      const response = await ContactService.create(req.user!, request);

      res.status(200).json({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = req.params.contactId;
      const response = await ContactService.get(req.user!, contactId);
      res.status(200).json({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateContactRequest = req.body as UpdateContactRequest;
      request.id = req.params.contactId;
      const response = await ContactService.update(req.user!, request);

      res.status(200).json({
        data: response
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const contactId = req.params.contactId;
      await ContactService.delete(req.user!, contactId);

      res.status(200).json({
        message: "Contact deleted"
      });
    } catch (error) {
      next(error);
    }
  }

  static async search(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: SearchContactRequest = {
        name: req.query.name as string,
        email: req.query.email as string,
        phone: req.query.phone as string,
        page: req.query.page ? Number(req.query.page) : 1,
        perPage: req.query.perPage ? Number(req.query.perPage) : 10,
      };
      const response = await ContactService.search(req.user!, request);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
