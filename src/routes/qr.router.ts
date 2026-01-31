import express from 'express'
const router=express.Router()
import { QrController } from "../controllers/qr/qr.controller";
import { QrRepository } from "../repositories/qr.repository";
import { QRService } from "../services/qr/rq.service";


const qrRepository=new QrRepository()
const qrService=new QRService(qrRepository)
const qrController=new QrController(qrService)


router.post("/generate",qrController.generateQr)
router.put("/verify",qrController.verifyQr)

export default router 