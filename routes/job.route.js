import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteJobs, getAdminJobs, getAllJobs, getJobById, postJob, updateJob } from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get( getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get( getJobById);
router.route("/delete/:id").delete(isAuthenticated, deleteJobs);
router.route("/update/:id").put(isAuthenticated, updateJob);

export default router;

