import express from 'express'
const router=express.Router()
import { QrController } from "../controllers/qr/qr.controller";
import { QrRepository } from "../repositories/qr.repository";
import { QRService } from "../services/qr/qr.service";
import { RewardProgressRepository } from '../repositories/reward.progress.repository';
import { RewardRepository } from '../repositories/reward.repository';
import { verifyToken } from '../middleware/auth.middleware';
import { RewardHistoryRepository } from '../repositories/reward.history.repository';
import { NotificationRepository } from '../repositories/notification.repository';


const qrRepository=new QrRepository()
const customerProgress=new RewardProgressRepository()
const rewardRepo=new RewardRepository()
const rewardHistoryRepo=new RewardHistoryRepository()
const notificationRepo=new NotificationRepository()
const qrService=new QRService(qrRepository,customerProgress,rewardRepo,rewardHistoryRepo,notificationRepo)
const qrController=new QrController(qrService)


router.post("/generate",qrController.generateQr)
router.put("/verify",verifyToken,qrController.verifyQr)

export default router 