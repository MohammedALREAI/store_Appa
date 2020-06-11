const AuthController = require("../Controller/auth");
const BookController = require("../Controller/book");
const UserController = require("../Controller/user");

const Router = require("express").Router();

Router.post("/login", AuthController.Login);
Router.post("/facebook", AuthController.AddFacebook);
router.post("/", BookController.addBook);
router.delete("/:slug", BookController.delateBook);
router.put("/:slug", BookController.PutADATAT);
router.post("/ckeckout", BookController.checkout);
router.delete("/", UserController.DeleteUser);
router.post("/", UserController.ADDUser);
router.put("/", UserController.updateUser);
router.delete("/", UserController.DeleteUser);
router.get("/userProfile", UserController.userProfile);
router.get("/", UserController.findAll);

module.export = Router;
