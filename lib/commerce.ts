export type CommerceProductType = 'consultation' | 'ebook'

export type CommercePaymentMethod = 'online' | 'blik_phone' | 'mock'

export type CommerceOrderStatus =
  | 'created'
  | 'waiting_manual_payment'
  | 'payment_reported'
  | 'paid'
  | 'access_sent'
  | 'cancelled'
  | 'expired'

export type CommerceAccessStatus = 'active' | 'used' | 'expired' | 'revoked'

export type CommerceProductMeta = {
  bookingId?: string
  bookingAccessToken?: string | null
  serviceType?: string
  productKind?: 'guide' | 'bundle'
  productSlug?: string
  downloadSlug?: string
  pdfFile?: string
  bundleGuideSlugs?: string[]
  animalType?: string
  problemType?: string
  notes?: string | null
}

export type CommerceOrder = {
  id: string
  orderNumber: string
  customerEmail: string
  customerName: string
  customerPhone: string | null
  productType: CommerceProductType
  productId: string
  productName: string
  amount: number
  onlineAmount: number
  manualAmount: number
  currency: 'PLN'
  paymentMethod: CommercePaymentMethod | null
  status: CommerceOrderStatus
  accessCode: string | null
  accessCodeStatus: CommerceAccessStatus | null
  accessCodeUsageCount: number
  accessCodeUsageLimit: number
  accessCodeExpiresAt: string | null
  adminConfirmationToken: string | null
  adminConfirmationTokenUsedAt: string | null
  adminConfirmationIp: string | null
  adminConfirmationUserAgent: string | null
  stripeCheckoutSessionId: string | null
  providerPaymentId: string | null
  createdAt: string
  updatedAt: string
  paidAt: string | null
  accessSentAt: string | null
  paymentReportedAt: string | null
  cancelledAt: string | null
  meta: CommerceProductMeta
}

export type CommerceCreateOrderInput = {
  customerEmail: string
  customerName: string
  customerPhone?: string | null
  productType: CommerceProductType
  productId: string
  productName: string
  amount: number
  onlineAmount?: number
  manualAmount?: number
  meta?: CommerceProductMeta
}

export function formatCommercePrice(amount: number) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount)
}

export function normalizeCommerceEmail(value: string) {
  return value.trim().toLowerCase()
}

export function isValidCommerceEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function getManualAmountForProduct(productType: CommerceProductType, amount: number) {
  if (productType === 'consultation' && amount >= 20) {
    return Math.max(0, amount - 5)
  }

  return amount
}
