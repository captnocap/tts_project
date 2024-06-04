import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import Order from '../models/order';
import { logError } from '../utils/logger';

const availableModels = ['model1', 'model2', 'model3']; // Example model names

export const getModels = (req: Request, res: Response) => {
  res.status(200).json({ models: availableModels });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const { orderId, orderNotes } = req.body;
  const order = new Order({ orderId, orderNotes });
  await order.save();
  res.status(200).send('Webhook received and order saved');
};

export const generateAudio = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { model } = req.query;
  const order = await Order.findOne({ orderId });

  if (!order) {
    return res.status(404).send('Order not found');
  }

  const outputPath = path.join(__dirname, `../../audio/${orderId}.wav`);
  exec(
    `python3 ./src/services/ttsService.py "${order.orderNotes}" "${outputPath}" "${model}"`,
    async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        logError(`exec error: ${error}`);
        return res.status(500).send('Error generating audio');
      }
      order.audioPath = outputPath;
      await order.save();
      res.download(outputPath);
    }
  );
};

export const synthesizeText = async (req: Request, res: Response) => {
  const { text, model } = req.body;
  const orderId = `custom_${new Date().getTime()}`;
  const outputPath = path.join(__dirname, `../../audio/${orderId}.wav`);

  exec(
    `python3 ./src/services/ttsService.py "${text}" "${outputPath}" "${model}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        logError(`exec error: ${error}`);
        return res.status(500).send('Error generating audio');
      }
      res.status(200).json({ orderId, audioPath: outputPath });
    }
  );
};
