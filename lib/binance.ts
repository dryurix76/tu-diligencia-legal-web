import crypto from 'node:crypto';

// Binance Pay Merchant API (v3 create order + signed webhooks).
// Requests: HMAC-SHA512 over "timestamp\nnonce\nbody\n", hex upper-case.
// Webhooks: RSA-SHA256 signature (base64) over the same payload, verified with the
// public key returned by the Query Certificate API.

const BASE = 'https://bpay.binanceapi.com';
const KEY = process.env.BINANCE_PAY_API_KEY || '';
const SECRET = process.env.BINANCE_PAY_SECRET || '';

export const binanceEnabled = () => !!(KEY && SECRET);

const nonce = () => Array.from(crypto.randomBytes(32)).map((b) => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'[b % 52]).join('');

async function call<T = any>(path: string, payload: Record<string, unknown>): Promise<T> {
  const body = JSON.stringify(payload);
  const ts = Date.now().toString();
  const n = nonce();
  const signature = crypto.createHmac('sha512', SECRET).update(`${ts}\n${n}\n${body}\n`).digest('hex').toUpperCase();
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'BinancePay-Timestamp': ts, 'BinancePay-Nonce': n, 'BinancePay-Certificate-SN': KEY, 'BinancePay-Signature': signature },
    body,
    cache: 'no-store',
  });
  const json = await res.json();
  if (json.status !== 'SUCCESS') throw new Error(`Binance Pay ${path}: ${json.code} ${json.errorMessage || ''}`);
  return json.data as T;
}

export async function createOrder(o: { ref: string; amountUsd: number; description: string; returnUrl: string; cancelUrl: string; webhookUrl: string; passThrough: Record<string, string> }) {
  return call<{ prepayId: string; checkoutUrl: string; qrcodeLink: string; universalUrl: string; expireTime: number }>('/binancepay/openapi/v3/order', {
    env: { terminalType: 'WEB' },
    merchantTradeNo: o.ref.replace(/[^A-Za-z0-9]/g, '').slice(0, 32),
    orderAmount: Number(o.amountUsd.toFixed(2)),
    currency: 'USDT',
    description: o.description.slice(0, 256),
    goodsDetails: [{ goodsType: '02', goodsCategory: 'Z000', referenceGoodsId: o.ref.slice(0, 64), goodsName: o.description.slice(0, 256) }],
    returnUrl: o.returnUrl,
    cancelUrl: o.cancelUrl,
    webhookUrl: o.webhookUrl,
    passThroughInfo: JSON.stringify(o.passThrough).slice(0, 512),
    orderExpireTime: Date.now() + 60 * 60 * 1000,
  });
}

let certCache: { sn: string; pem: string; at: number }[] = [];

async function publicKey(sn: string): Promise<string | null> {
  if (!certCache.length || Date.now() - certCache[0].at > 6 * 3600e3) {
    const certs = await call<{ certSerial: string; certPublic: string }[]>('/binancepay/openapi/certificates', {});
    certCache = certs.map((c) => ({ sn: c.certSerial, pem: c.certPublic, at: Date.now() }));
  }
  return (certCache.find((c) => c.sn === sn) || certCache[0])?.pem || null;
}

export async function verifyWebhook(headers: Headers, rawBody: string): Promise<boolean> {
  const ts = headers.get('BinancePay-Timestamp') || '';
  const n = headers.get('BinancePay-Nonce') || '';
  const sig = headers.get('BinancePay-Signature') || '';
  const sn = headers.get('BinancePay-Certificate-SN') || '';
  if (!ts || !n || !sig) return false;
  const pem = await publicKey(sn);
  if (!pem) return false;
  const key = pem.includes('BEGIN') ? pem : `-----BEGIN PUBLIC KEY-----\n${pem}\n-----END PUBLIC KEY-----`;
  return crypto.createVerify('RSA-SHA256').update(`${ts}\n${n}\n${rawBody}\n`).verify(key, Buffer.from(sig, 'base64'));
}
