import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../../middlewares/auth';
import { initiateDonation, verifyDonation, getDonationStats, getUserDonations } from './donation.service';
import prisma from '../../config/database';

const initiateSchema = z.object({
  amount: z.number().positive(),
  campaignId: z.string().optional(),
});

const verifySchema = z.object({
  donationId: z.string().cuid(),
  transactionId: z.string().min(1),
});

export const initiate = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, campaignId } = initiateSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: req.user!.email! } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const donation = await initiateDonation(user.id, amount, campaignId);
    res.status(201).json(donation);
  } catch (error) {
    throw error;
  }
};

export const verify = async (req: Request, res: Response) => {
  try {
    const { donationId, transactionId } = verifySchema.parse(req.body);
    const donation = await verifyDonation(donationId, transactionId);
    res.json(donation);
  } catch (error) {
    throw error;
  }
};

export const stats = async (_req: Request, res: Response) => {
  try {
    const data = await getDonationStats();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const myDonations = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { email: req.user!.email! } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const donations = await getUserDonations(user.id);
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};
