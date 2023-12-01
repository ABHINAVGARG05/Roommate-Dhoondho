import express from "express";
import { isAdmin } from '../Middlewares/isAdmin.js';
import { dontExecuteAtProduction } from '../Middlewares/dontExecuteAtProduction.js';
import { deleteUser, followUser, getAllUser, getUser, getPersonalUser, UnFollowUser, updateUser, updateUserByAdmin, likeRoom, likeRoommate } from "../Controllers/UserController.js";

const router = express.Router();

router.get('/all', getAllUser)
router.get('/:id', getUser)
router.get('/personal/:id', getPersonalUser)
router.put('/:id', updateUser)
router.put('/admin/:id', dontExecuteAtProduction, isAdmin, updateUserByAdmin)
router.delete('/:id', deleteUser)
router.put('/:id/follow', followUser)
router.put('/:id/unfollow', UnFollowUser)
router.put('/:id/likesroom', likeRoom)
router.put('/:id/likesroommate', likeRoommate)
export default router;