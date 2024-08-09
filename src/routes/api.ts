import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { UserController } from '../controllers/userController';
import { ContactController } from '../controllers/contactController';
import { AddressController } from '../controllers/addressController';

export const  apiRouter = express.Router()
apiRouter.use(authMiddleware);

// User API
apiRouter.get("/api/users/me", UserController.me)
apiRouter.put("/api/users", UserController.update)
apiRouter.delete("/api/users", UserController.logout);

// Contact API
apiRouter.post("/api/contacts", ContactController.create);
apiRouter.get("/api/contacts/:contactId", ContactController.get);
apiRouter.put("/api/contacts/:contactId", ContactController.update);
apiRouter.delete("/api/contacts/:contactId", ContactController.delete);
apiRouter.get("/api/contacts", ContactController.search);

// Address Api
apiRouter.post("/api/contacts/:contactId/addresses", AddressController.create);
apiRouter.get("/api/contacts/:contactId/addresses/:addressId", AddressController.get);
apiRouter.put("/api/contacts/:contactId/addresses/:addressId", AddressController.update);
apiRouter.delete("/api/contacts/:contactId/addresses/:addressId", AddressController.remove);
apiRouter.get("/api/contacts/:contactId/addresses", AddressController.list);
