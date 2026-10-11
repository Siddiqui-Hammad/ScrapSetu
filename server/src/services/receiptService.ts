import crypto from 'crypto';

export interface ReceiptData {
  pickupId: string;
  collectorId: string;
  requesterId: string;
  totalWeightKg: number;
  totalAmount: number;
  paymentMode: string;
  paymentStatus: string;
  items: Array<{
    categoryName: string;
    actualQty: number;
    agreedPricePerUnit: number;
    itemTotal: number;
  }>;
}

export class ReceiptService {
  /**
   * Generates a sequential unique receipt number
   */
  static generateReceiptNumber(cityPrefix: string = 'JP'): string {
    const year = new Date().getFullYear();
    const randomHex = Math.floor(10000 + Math.random() * 90000);
    return `REC-${year}-${cityPrefix}-${randomHex}`;
  }

  /**
   * Generates a tamper-evident SHA-256 digital cryptographic hash
   */
  static generateReceiptHash(data: {
    receiptNumber: string;
    pickupId: string;
    collectorId: string;
    requesterId: string;
    totalAmount: number;
    totalWeightKg: number;
    timestamp: string;
  }): string {
    const payload = `${data.receiptNumber}|${data.pickupId}|${data.collectorId}|${data.requesterId}|${data.totalAmount}|${data.totalWeightKg}|${data.timestamp}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Validates receipt integrity
   */
  static verifyReceiptHash(
    expectedHash: string,
    data: {
      receiptNumber: string;
      pickupId: string;
      collectorId: string;
      requesterId: string;
      totalAmount: number;
      totalWeightKg: number;
      timestamp: string;
    }
  ): boolean {
    const computed = this.generateReceiptHash(data);
    return computed === expectedHash;
  }
}
