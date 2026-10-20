import { STORE_INFO } from '../data/catalog'
import type { CheckoutPayload } from '../types'

export function useWhatsAppOrder() {
  /**
   * Format number to Indonesian Rupiah currency string
   */
  const formatRupiah = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  /**
   * Generates formatted WhatsApp URL based on order/consultation payload
   */
  const generateWhatsAppUrl = (payload: CheckoutPayload): string => {
    const isProduct = payload.itemType === 'product'
    const timeString = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

    let message = ''

    if (isProduct) {
      message = [
        `Halo Admin *${STORE_INFO.brandName}*,`,
        `Saya ingin memesan produk digital dengan rincian berikut:`,
        ``,
        `🛒 *Detail Pesanan:*`,
        `• Produk: *${payload.itemName}*`,
        `• Tipe/Varian: ${payload.itemVariantOrCategory}`,
        `• Harga: *${payload.priceDisplay}*`,
        `• Tanggal: ${timeString}`,
        ``,
        `👤 *Data Pemesan:*`,
        `• Nama: *${payload.customerName.trim()}*`,
        payload.notes ? `• Catatan: ${payload.notes.trim()}` : null,
        ``,
        `Mohon instruksi pembayaran (QRIS / Rekening BCA/Mandiri) untuk segera diproses. Terima kasih!`,
      ]
        .filter(Boolean)
        .join('\n')
    } else {
      message = [
        `Halo Mas Syaifulloh (*${STORE_INFO.brandName}*),`,
        `Saya tertarik untuk berkonsultasi mengenai jasa software development:`,
        ``,
        `💻 *Paket Layanan:*`,
        `• Layanan: *${payload.itemName}*`,
        `• Kategori: ${payload.itemVariantOrCategory}`,
        `• Estimasi Mulai: *${payload.priceDisplay}*`,
        ``,
        `👤 *Kontak Klien:*`,
        `• Nama: *${payload.customerName.trim()}*`,
        payload.notes ? `• Kebutuhan Proyek: ${payload.notes.trim()}` : null,
        ``,
        `Apakah bisa dijadwalkan sesi diskusi singkat / penawaran proposal untuk proyek ini? Terima kasih!`,
      ]
        .filter(Boolean)
        .join('\n')
    }

    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodedMessage}`
  }

  /**
   * Directly open the WhatsApp URL in a new window/tab
   */
  const openWhatsApp = (payload: CheckoutPayload): void => {
    const url = generateWhatsAppUrl(payload)
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return {
    formatRupiah,
    generateWhatsAppUrl,
    openWhatsApp,
  }
}
