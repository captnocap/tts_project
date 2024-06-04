import { Router } from 'express';
import {
  handleWebhook,
  generateAudio,
  listAudioFiles,
  deleteAudioFile,
  synthesizeText,
  getModels
} from '../controllers/ttsController.ts';

const router = Router();

router.post('/webhook', handleWebhook);
router.get('/audio/:orderId', generateAudio);
router.get('/list', listAudioFiles);
router.delete('/audio/:orderId', deleteAudioFile);
router.post('/synthesize', synthesizeText);
router.get('/models', getModels); // New route for fetching available TTS models

export default router;
