import prisma from './prisma.js';

export async function logAuditEvent({
  userId,
  action,
  resource,
  resourceId,
  details,
  ipAddress,
}: {
  userId?: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  details?: Record<string, any> | string;
  ipAddress?: string;
}) {
  try {
    const detailsStr = typeof details === 'object' ? JSON.stringify(details) : details;
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        resource,
        resourceId: resourceId || null,
        details: detailsStr || null,
        ipAddress: ipAddress || null,
      },
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
