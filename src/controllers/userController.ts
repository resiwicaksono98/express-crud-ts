import { UserService } from "../services/userService";
import { UserRequest } from "../type/userRequest";
import {
  CreateUserRequest,
  LoginUserRequest,
  UpdateUserRequest
} from "./../models/userModel";
import { Request, Response, NextFunction } from "express";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const user = await UserService.register(request);

      res.status(200).json({
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const request: LoginUserRequest = req.body as LoginUserRequest;
      const user = await UserService.login(request);

      res.status(200).json({
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getMe(req.user!);

      res.status(200).json({
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: UserRequest, res: Response, next: NextFunction) {
    try {
      const request: UpdateUserRequest = req.body;
      const user = await UserService.update(req.user!, request);

      res.status(200).json({
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: UserRequest, res: Response, next:NextFunction){
    try {
        const response = await UserService.logout(req.user!)
        res.status(200).json({
            data: "OK"
        })
    } catch (error) {
        next(error)
    }
  }
}
