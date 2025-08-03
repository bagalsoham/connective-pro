import { Router } from "express";
import { login, register, uploadProfilePicture, updateUserProfile, getUserAndProfile, updateProfileData, getAllUserProfile, downloadProfile } from "../controllers/user.controller.js";
import multer from 'multer';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'profile_picture/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

router.route("/update_profile_picture")
    .post(upload.single('profile_picture'), uploadProfilePicture)

router.route('/register').post(register);
router.route('/login').post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").post(getUserAndProfile); // Note: this should probably be POST since it needs token in body
router.route("/update_profile_data").post(updateProfileData); // Changed from GET to POST
router.route("/get_all_users").get(getAllUserProfile);
router.route("/download_resume").get(downloadProfile); // Keep as GET for now



export default router;