import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { ReceiptService } from '../services/receiptService.js';

export async function getReceiptByNumber(req: Request, res: Response): Promise<void> {
  try {
    const { receiptNumber } = req.params;

    const txn = await prisma.transaction.findUnique({
      where: { receiptNumber },
      include: {
        collector: { select: { id: true, name: true, phone: true, profile: true } },
        requester: { select: { id: true, name: true, phone: true, email: true } },
        pickupRequest: {
          include: {
            address: true,
            actualCollected: { include: { category: true } },
          },
        },
      },
    });

    if (!txn) {
      res.status(404).json({ success: false, message: 'Digital receipt not found.' });
      return;
    }

    const isHashValid = ReceiptService.verifyReceiptHash(txn.receiptHash, {
      receiptNumber: txn.receiptNumber,
      pickupId: txn.pickupRequestId,
      collectorId: txn.collectorId,
      requesterId: txn.requesterId,
      totalAmount: txn.totalAmount,
      totalWeightKg: txn.totalWeightKg,
      timestamp: txn.transactionDate.toISOString(),
    });

    res.json({
      success: true,
      receipt: {
        receiptNumber: txn.receiptNumber,
        receiptHash: txn.receiptHash,
        isCryptographicallyValid: isHashValid,
        transactionDate: txn.transactionDate,
        collector: txn.collector,
        requester: txn.requester,
        pickupAddress: txn.pickupRequest.address,
        totalWeightKg: txn.totalWeightKg,
        totalAmount: txn.totalAmount,
        paymentMode: txn.paymentMode,
        paymentStatus: txn.paymentStatus,
        notes: txn.notes,
        items: txn.pickupRequest.actualCollected.map((i) => ({
          categoryName: i.category.name,
          hindiName: i.category.hindiName,
          actualQty: i.actualQty,
          unit: i.category.defaultUnit,
          agreedPricePerUnit: i.agreedPricePerUnit,
          itemTotal: i.itemTotal,
          grade: i.gradeRecorded,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving digital receipt.' });
  }
}

export async function listUserTransactions(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const txns = await prisma.transaction.findMany({
      where: {
        OR: [{ requesterId: req.user.id }, { collectorId: req.user.id }],
      },
      include: {
        collector: { select: { id: true, name: true } },
        requester: { select: { id: true, name: true } },
        pickupRequest: {
          include: {
            actualCollected: { include: { category: true } },
          },
        },
      },
      orderBy: { transactionDate: 'desc' },
    });

    res.json({ success: true, count: txns.length, transactions: txns });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error listing transactions.' });
  }
}
