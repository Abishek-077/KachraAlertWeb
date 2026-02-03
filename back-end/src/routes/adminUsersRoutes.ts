import { Router } from "express";
import * as usersController from "../controllers/usersController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { adminCreateUserSchema, adminUpdateUserSchema } from "../dto/adminUserSchemas.js";
import { profileImageUpload } from "../middleware/upload.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.post("/users", profileImageUpload.single("image"), validateBody(adminCreateUserSchema), usersController.createUser);
router.get("/users", usersController.listUsers);
router.get("/users/:id", usersController.getUser);
router.put(
  "/users/:id",
  profileImageUpload.single("image"),
  validateBody(adminUpdateUserSchema),
  usersController.updateUser
);
router.delete("/users/:id", usersController.deleteUser);

export default router;
