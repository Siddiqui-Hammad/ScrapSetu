import React from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Printer,
  X,
  FileCheck,
  Building,
  User,
  Scale,
  Calendar,
} from 'lucide-react';

interface ReceiptModalProps {
  receipt: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ receipt, isOpen, onClose }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-lg print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Receipt Header */}
        <div className="border-b border-stone-200 pb-4 mb-4 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 mb-2">
            <FileCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-stone-900">ScrapSetu Digital Recycling Receipt</h2>
          <div className="text-xs text-stone-500 mt-0.5">
            Verified Physical Weighing & Environmental Settlement Record
          </div>
          <div className="mt-2 inline-block px-3 py-1 bg-stone-100 rounded-md font-mono text-xs font-bold text-stone-800">
            Receipt #{receipt.receiptNumber}
          </div>
        </div>

        {/* Cryptographic Hash Badge */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Cryptographic Integrity Status: {receipt.isCryptographicallyValid ? 'VERIFIED (Tamper-Proof)' : 'PENDING'}</span>
          </div>
          <div className="font-mono text-[10px] text-stone-600 break-all bg-white/80 p-1.5 rounded border border-emerald-100">
            SHA256: {receipt.receiptHash}
          </div>
        </div>

        {/* Parties Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs mb-4 p-3 bg-stone-50 rounded-xl">
          <div>
            <span className="text-stone-400 uppercase font-semibold block text-[10px]">Seller / Generator</span>
            <div className="font-bold text-stone-900 mt-0.5">{receipt.requester?.name || 'Verified User'}</div>
            <div className="text-stone-500">{receipt.pickupAddress?.streetAddress || receipt.pickupAddress?.area}</div>
            <div className="text-stone-500">{receipt.pickupAddress?.city} - {receipt.pickupAddress?.pincode}</div>
          </div>
          <div>
            <span className="text-stone-400 uppercase font-semibold block text-[10px]">Collector (Kabadiwala)</span>
            <div className="font-bold text-stone-900 mt-0.5">{receipt.collector?.name || 'Ramkishan Sahu'}</div>
            <div className="text-stone-500">Phone: {receipt.collector?.phone || '+91 98290 44004'}</div>
            <div className="text-emerald-700 font-medium">ScrapSetu Verified Partner ✓</div>
          </div>
        </div>

        {/* Weighed Items Breakdown Table */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            Physically Weighed Materials
          </h4>
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-2.5">Category & Grade</th>
                  <th className="p-2.5 text-right">Net Weight</th>
                  <th className="p-2.5 text-right">Agreed Rate</th>
                  <th className="p-2.5 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {receipt.items && receipt.items.length > 0 ? (
                  receipt.items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="p-2.5">
                        <div className="font-medium text-stone-900">{item.categoryName}</div>
                        {item.grade && <div className="text-[10px] text-stone-500">{item.grade}</div>}
                      </td>
                      <td className="p-2.5 text-right font-medium">{item.actualQty} {item.unit || 'kg'}</td>
                      <td className="p-2.5 text-right text-stone-600">₹{item.agreedPricePerUnit}/{item.unit || 'kg'}</td>
                      <td className="p-2.5 text-right font-bold text-stone-900">₹{item.itemTotal}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center text-stone-500">
                      Total Weight: {receipt.totalWeightKg} kg
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-emerald-50/60 font-bold border-t border-emerald-200 text-stone-900">
                <tr>
                  <td className="p-2.5">Settlement Total</td>
                  <td className="p-2.5 text-right text-emerald-800">{receipt.totalWeightKg} kg</td>
                  <td className="p-2.5 text-right">Paid via {receipt.paymentMode || 'UPI'}</td>
                  <td className="p-2.5 text-right text-base text-emerald-800">₹{receipt.totalAmount}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Verification Footer Notes */}
        <div className="text-[11px] text-stone-500 bg-stone-50 p-3 rounded-xl space-y-1 mb-4">
          <p>• <b>Measurement Standard:</b> Weights calibrated against legal metrology guidelines.</p>
          <p>• <b>Circular Economy Routing:</b> Recovered secondary raw materials dispatched to accredited recycling facilities.</p>
          <p>• <b>Timestamp:</b> {new Date(receipt.transactionDate || Date.now()).toLocaleString('en-IN')}</p>
        </div>

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
