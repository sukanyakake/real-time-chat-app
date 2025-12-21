import express from "express"
import { signup,login,logout ,updateProfile} from "../controllers/auth.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"
const router=express.Router()

router.use(arcjetProtection)
router.post("/signup",signup)
router.get("/test",(req,res)=>res.status(200).json({message:"Test "}))

router.post("/login", login)
router.post("/logout",logout)
router.post("/update-profile",protectedRoute,updateProfile)
router.get("/check",protectedRoute,(req,res)=>res.status(200).json(req.user))
export default router