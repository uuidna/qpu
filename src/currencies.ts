import { EUR, USD } from '@payloadcms/plugin-ecommerce'
import type { CurrenciesConfig, Currency } from '@payloadcms/plugin-ecommerce/types'

const BGN: Currency = { code: 'BGN', decimals: 2, label: 'Bulgarian lev', symbol: 'лв' }
const currencies: CurrenciesConfig = { defaultCurrency: 'EUR', supportedCurrencies: [EUR, USD, BGN] }
const USD_PER_EUR = 1.1193
const BGN_PER_EUR = 1.95583
const prices = (amount: { eur?: number; usd?: number }) => {
  const eur = amount.eur ?? Math.round((amount.usd ?? 0) / USD_PER_EUR)
  const usd = amount.usd ?? Math.round(eur * USD_PER_EUR)
  const bgn = Math.round(eur * BGN_PER_EUR)
  return {
    priceInEUREnabled: true as const,
    priceInEUR: eur,
    priceInUSDEnabled: true as const,
    priceInUSD: usd,
    priceInBGNEnabled: true as const,
    priceInBGN: bgn,
  }
}
export { currencies, prices }
