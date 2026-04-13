/**
 * Share link encoding/decoding.
 * State is stored in the URL hash as: #share=<base64url-encoded JSON>
 *
 * Share payload contains only aggregated category totals and card IDs —
 * no transaction-level data or PII.
 */

export interface SharePayload {
  v: 1
  spending: Array<{ cat: string; total: number }>
  wallet: string[]
}

const HASH_PREFIX = 'share='

function toBase64Url(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '===='.slice((str.length % 4) || 4)
  return atob(padded)
}

export function encodeShareState(
  breakdown: Array<{ category: string; annualTotal: number }>,
  walletCardIds: string[],
): string {
  const payload: SharePayload = {
    v: 1,
    spending: breakdown.map((b) => ({ cat: b.category, total: b.annualTotal })),
    wallet: walletCardIds,
  }
  const encoded = toBase64Url(JSON.stringify(payload))
  const url = new URL(window.location.href)
  url.hash = HASH_PREFIX + encoded
  return url.toString()
}

export function decodeShareHash(hash: string): SharePayload | null {
  try {
    if (!hash.startsWith('#' + HASH_PREFIX)) return null
    const encoded = hash.slice(1 + HASH_PREFIX.length)
    if (!encoded) return null
    const json = fromBase64Url(encoded)
    const payload = JSON.parse(json) as unknown
    if (
      typeof payload !== 'object' ||
      payload === null ||
      (payload as SharePayload).v !== 1 ||
      !Array.isArray((payload as SharePayload).spending) ||
      !Array.isArray((payload as SharePayload).wallet)
    ) {
      return null
    }
    return payload as SharePayload
  } catch {
    return null
  }
}
