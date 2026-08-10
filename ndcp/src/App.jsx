import { useState } from 'react'
import './App.css'

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 2.75h6.9L18.75 7.6V21.25H7A2.25 2.25 0 0 1 4.75 19V5A2.25 2.25 0 0 1 7 2.75Z" fill="currentColor" opacity="0.18" />
      <path d="M13.9 2.75V7.5h4.85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.8 10.2h8.4M7.8 13.2h8.4M7.8 16.2h5.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function CafeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 10h10a3 3 0 0 1 0 6H6z" fill="currentColor" opacity="0.18" />
      <path d="M7.5 10V7.8A4.8 4.8 0 0 1 12.3 3m6.2 7h1.2a2.1 2.1 0 1 1 0 4.2h-1.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7.2 16.5h10.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.2 6.2c.7.7.7 1.5 0 2.2m2-2.2c.7.7.7 1.5 0 2.2m2-2.2c.7.7.7 1.5 0 2.2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function DiningIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.8 4.5v7.2m0 0H6m-1.2 0V20m3.4-15.5V20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14.2 4.5c0 2.7-.1 5.3 0 8.1.1 1.1.9 1.9 2 2v5.4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 4.5v7.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.4 4.5v15.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.2 11h4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 8.2h15l-1 6.2H5.5z" fill="currentColor" opacity="0.16" />
      <path d="M5.3 8.2 6.2 4.7h11.6l.9 3.5M7.6 14.4v5.1h8.8v-5.1" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.7 8.2h14.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 14.4h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function FitnessIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5.5 9.2v5.6M8 6.9v10.2M16 6.9v10.2M18.5 9.2v5.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 11h8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4Zm0 3.1.9 1.8 2 .3-1.4 1.3.3 1.9-1.8-.9-1.8.9.3-1.9-1.4-1.3 2-.3Z" fill="currentColor" opacity="0.18" />
    </svg>
  )
}

function BarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 5.2h12l-4.2 4.9V19H10.2v-8.9z" fill="currentColor" opacity="0.18" />
      <path d="M7 5.2h10M10.8 10.1h2.4M10.8 13h2.4M10.8 15.8h2.4M8.7 5.2 12 9l3.3-3.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5 14.8 8l5.1.8-3.7 3.8.8 5.1-5-2.7-5 2.7.8-5.1-3.7-3.8L9.2 8z" fill="currentColor" opacity="0.18" />
      <path d="m12 6.2 1.8 2.9 3.4.5-2.4 2.5.5 3.4L12 13.8 8.7 15.5l.5-3.4-2.4-2.5 3.4-.5z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

function MallIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4.5 8.5h15l-1.2 10.2H5.7z" fill="currentColor" opacity="0.16" />
      <path d="M6.2 8.5V6.6c0-.8.6-1.4 1.4-1.4h8.8c.8 0 1.4.6 1.4 1.4v1.9M8.1 8.5V6.3M11 8.5V6.3M13.9 8.5V6.3M16.8 8.5V6.3M7.2 12.1h9.6M7.2 15h9.6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5.5 6.5h2.1l1 8.1h8.2l1.3-6.1H8.2" fill="currentColor" opacity="0.16" />
      <path d="M6 6.5h2.5l1 8.1h8.3l1.4-6.6H8.9M9 18.1a1 1 0 1 0 0 .1m6.7 0a1 1 0 1 0 0 .1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KaraokeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M15.8 3.8h1.9v11.1a3.5 3.5 0 1 1-1.9-3.1z" fill="currentColor" opacity="0.18" />
      <path d="M15.8 3.8v8.6a3.5 3.5 0 1 0 1.9 3.1V5.4M8.2 16.9l4.2-4.2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.8 6.7a3 3 0 1 0 4.2 4.2" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function HotelIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 7.2h14V20H5z" fill="currentColor" opacity="0.16" />
      <path d="M7.1 7.2V4.8h9.8v2.4M8.2 10.1h2.6v2.6H8.2Zm5 0h2.6v2.6h-2.6ZM8.2 14h2.6v2.6H8.2Zm5 0h2.6v2.6h-2.6Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

const businessTypes = [
  { id: 'cafe', label: 'Quán café', icon: CafeIcon },
  { id: 'restaurant', label: 'Nhà hàng, phòng hội thảo, hội nghị', icon: DiningIcon },
  { id: 'shop', label: 'Cửa hàng, showroom', icon: ShopIcon },
  { id: 'spa', label: 'CLB thể dục, SPA', icon: FitnessIcon },
  { id: 'bar', label: 'Quán bar', icon: BarIcon },
  { id: 'playground', label: 'Khu vui chơi', icon: PlayIcon },
  { id: 'mall', label: 'Trung tâm thương mại', icon: MallIcon },
  { id: 'supermarket', label: 'Siêu thị', icon: CartIcon },
  { id: 'karaoke', label: 'Karaoke', icon: KaraokeIcon },
  { id: 'hotel', label: 'Khách sạn', icon: HotelIcon },
]

const regions = [
  { id: 'special', label: 'Đô thị đặc biệt (Hà Nội, TP.HCM)', multiplier: 1.0 },
  { id: 'grade1', label: 'Đô thị loại I (Đà Nẵng, Cần Thơ, Hải Phòng)', multiplier: 0.8 },
  { id: 'grade2', label: 'Đô thị loại II (Huế, Nha Trang, Biên Hòa)', multiplier: 0.5 },
  { id: 'grade3', label: 'Đô thị loại III (thị xã, tỉnh lẻ)', multiplier: 0.2 },
  { id: 'industrial', label: 'Khu Công nghiệp / KKT đặc biệt', multiplier: 0.1 },
  { id: 'rural', label: 'Nông thôn / Vùng sâu / Miền núi', multiplier: 0.1 },
]

const parameterCards = [
  {
    title: 'T1',
    body: 'Ngưỡng diện tích hoặc số phòng bậc 1. Từ 0 đến T1 áp dụng hệ số cơ bản.',
    tone: 'blue',
  },
  {
    title: 'T2',
    body: 'Ngưỡng bậc 2. Phần vượt T1 đến T2 áp dụng hệ số cộng thêm.',
    tone: 'indigo',
  },
  {
    title: 'A_BASE',
    body: 'Hệ số khởi điểm của ngành. Dùng làm nền cho bậc 1 trước khi cộng dồn.',
    tone: 'slate',
  },
  {
    title: 'R2 / R3',
    body: 'Hệ số cộng thêm ở bậc 2 và bậc 3. Phần diện tích lớn sẽ tăng nhanh hơn.',
    tone: 'violet',
  },
  {
    title: 'CAP',
    body: 'Trần tối đa của ngành. Dù diện tích rất lớn, phí vẫn không vượt quá mức này.',
    tone: 'amber',
  },
  {
    title: 'B',
    body: 'Mức lương cơ sở dùng để quy đổi ra tiền. Có thể cập nhật khi chính sách thay đổi.',
    tone: 'emerald',
  },
]

const formatMultiplier = (multiplier) => `x${multiplier.toFixed(2).replace('.', ',')}`

const baseSalary = 2_530_000
const vatRate = 0.08
const cafeCap = 8
const cafeTier1Base = 0.35
const cafeTier1Limit = 15
const restaurantCap = 8
const restaurantTier1Base = 2.0
const restaurantTier1Limit = 50
const shopCap = 5
const shopTier1Base = 0.35
const shopTier1Limit = 50
const fitnessCap = 10
const fitnessTier1Base = 0.5
const fitnessTier1Limit = 50
const barCap = 27
const barTier1Base = 2.35
const barTier1Limit = 50
const barTier2Limit = 200
const playgroundCap = 12
const playgroundTier1Base = 0.7
const playgroundTier1Limit = 200
const playgroundTier2Limit = 500
const mallCap = 50
const mallTier1Base = 1.5
const mallTier1Limit = 200
const mallTier2Limit = 500
const supermarketCap = 10
const supermarketTier1Base = 1.25
const supermarketTier1Limit = 500
const supermarketTier2Limit = 1000

const tierRules = [
  { label: 'Bậc 1', range: '0 - 15 m²', min: 0, max: 15, rate: 0.0233 },
  { label: 'Bậc 2', range: '15 - 50 m²', min: 15, max: 50, rate: 0.04 },
  { label: 'Bậc 3', range: '> 50 m²', min: 50, max: Number.POSITIVE_INFINITY, rate: 0.02 },
]

const karaokeRoomRules = [
  {
    key: 'roomSmall',
    label: 'Phòng ≤ 20m²',
    hint: '(hệ số: 1,50 / 1,20 / 1,05)',
    coefficients: [1.5, 1.2, 1.05],
  },
  {
    key: 'roomMid',
    label: 'Phòng 20-30m²',
    hint: '(hệ số: 1,60 / 1,28 / 1,12)',
    coefficients: [1.6, 1.28, 1.12],
  },
  {
    key: 'roomLarge',
    label: 'Phòng > 30m²',
    hint: '(hệ số: 1,70 / 1,36 / 1,19)',
    coefficients: [1.7, 1.36, 1.19],
  },
]

const karaokeBoxRule = {
  key: 'vipBox',
  label: 'Box karaoke (cố định)',
  hint: '(hệ số: 0,85/box/năm)',
  fixed: 0.85,
}

const hotelRules = [
  {
    key: 'room45',
    label: 'Phòng 4 - 5 sao (hoặc tương đương)',
    hint: '(hệ số: 0,03/phòng/năm)',
    rate: 0.03,
  },
  {
    key: 'room13',
    label: 'Phòng 1 - 3 sao (hoặc tương đương)',
    hint: '(hệ số: 0,02/phòng/năm)',
    rate: 0.02,
  },
]

const fullParameterRows = [
  { type: 'Quán café', unit: 'm²', t1: '15', t2: '50', aBase: '0,35', r2: '0,04', r3: '0,02', cap: '8' },
  { type: 'Nhà hàng, phòng hội thảo, hội nghị', unit: 'm²', t1: '50', t2: '100', aBase: '2,0', r2: '0,05', r3: '0,03', cap: '8' },
  { type: 'Cửa hàng, showroom', unit: 'm²', t1: '50', t2: '100', aBase: '0,35', r2: '0,008', r3: '0,006', cap: '5' },
  { type: 'CLB thể dục, SPA', unit: 'm²', t1: '50', t2: '100', aBase: '0,50', r2: '0,011', r3: '0,009', cap: '10' },
  { type: 'Quán bar', unit: 'm²', t1: '50', t2: '200', aBase: '2,35', r2: '0,06', r3: '0,05', cap: '27' },
  { type: 'Khu vui chơi', unit: 'm²', t1: '200', t2: '500', aBase: '0,70', r2: '0,003', r3: '0,001', cap: '12' },
  { type: 'Trung tâm TM', unit: 'm²', t1: '200', t2: '500', aBase: '1,50*', r2: '0,003', r3: '0,002', cap: '50' },
  { type: 'Siêu thị', unit: 'm²', t1: '500', t2: '1000', aBase: '1,25*', r2: '0,003', r3: '0,002', cap: '10' },
  { type: 'Karaoke ≤20m²/phòng', unit: 'phòng', t1: '4', t2: '10', aBase: '1,50', r2: '1,20', r3: '1,05', cap: '—' },
  { type: 'Karaoke 20-30m²/phòng', unit: 'phòng', t1: '4', t2: '10', aBase: '1,60', r2: '1,28', r3: '1,12', cap: '—' },
  { type: 'Karaoke >30m²/phòng', unit: 'phòng', t1: '4', t2: '10', aBase: '1,70', r2: '1,36', r3: '1,19', cap: '—' },
  { type: 'Box VIP (cố định)', unit: 'phòng', t1: '—', t2: '—', aBase: '0,85', r2: '—', r3: '—', cap: '—' },
  { type: 'Khách sạn 4 - 5 sao (hoặc tương đương)', unit: 'phòng', t1: '—', t2: '—', aBase: '0,03', r2: '—', r3: '—', cap: '—' },
  { type: 'Khách sạn 1 - 3 sao (hoặc tương đương)', unit: 'phòng', t1: '—', t2: '—', aBase: '0,02', r2: '—', r3: '—', cap: '—' },
]

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Math.round(value))} ₫`
const formatVndPlain = (value) => `${new Intl.NumberFormat('vi-VN').format(Math.round(value))} VND`
const formatNumber = (value, fractionDigits = 2) =>
  new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value)

function calculateTierQuantity(area, min, max) {
  if (area <= min) {
    return 0
  }

  if (!Number.isFinite(max)) {
    return area - min
  }

  return Math.min(area, max) - min
}

function App() {
  const [selectedType, setSelectedType] = useState(businessTypes[0].id)
  const [selectedRegion, setSelectedRegion] = useState(regions[0].id)
  const [area, setArea] = useState('')
  const [karaokeCounts, setKaraokeCounts] = useState({
    roomSmall: '0',
    roomMid: '0',
    roomLarge: '0',
    vipBox: '0',
  })
  const [hotelCounts, setHotelCounts] = useState({
    room45: '0',
    room13: '0',
  })
  const [feeResult, setFeeResult] = useState(null)

  const clearResult = () => setFeeResult(null)

  const activeRegion = regions.find((item) => item.id === selectedRegion) ?? regions[0]
  const isKaraoke = selectedType === 'karaoke'
  const isHotel = selectedType === 'hotel'
  const isCafe = selectedType === 'cafe'
  const isRestaurant = selectedType === 'restaurant'
  const isShop = selectedType === 'shop'
  const isFitness = selectedType === 'spa'
  const isBar = selectedType === 'bar'
  const isPlayground = selectedType === 'playground'
  const isMall = selectedType === 'mall'
  const isSupermarket = selectedType === 'supermarket'

  const handleCalculate = () => {
    let rows = []
    let totalA = 0
    let rawTotalA = 0
    let annualFee = 0
    let safeArea = 0
    let hasValidInput = false

    if (isKaraoke) {
      rows = karaokeRoomRules.flatMap((rule) => {
        const countRaw = Number.parseInt(karaokeCounts[rule.key], 10)
        const totalRooms = Number.isFinite(countRaw) && countRaw > 0 ? countRaw : 0

        const tier1Qty = Math.min(totalRooms, 4)
        const tier2Qty = Math.max(Math.min(totalRooms, 10) - 4, 0)
        const tier3Qty = Math.max(totalRooms - 10, 0)

        return [
          {
            label: `${rule.label} - Từ 1 đến 4 phòng`,
            range: 'Bậc phòng 1-4',
            quantity: tier1Qty,
            rate: rule.coefficients[0],
            contribution: tier1Qty * rule.coefficients[0],
            unit: 'phòng',
          },
          {
            label: `${rule.label} - Từ phòng 5 đến 10`,
            range: 'Bậc phòng 5-10',
            quantity: tier2Qty,
            rate: rule.coefficients[1],
            contribution: tier2Qty * rule.coefficients[1],
            unit: 'phòng',
          },
          {
            label: `${rule.label} - Từ phòng 11 trở đi`,
            range: 'Bậc phòng 11+',
            quantity: tier3Qty,
            rate: rule.coefficients[2],
            contribution: tier3Qty * rule.coefficients[2],
            unit: 'phòng',
          },
        ]
      })

      const boxRaw = Number.parseInt(karaokeCounts[karaokeBoxRule.key], 10)
      const boxQuantity = Number.isFinite(boxRaw) && boxRaw > 0 ? boxRaw : 0

      rows.push({
        label: karaokeBoxRule.label,
        range: 'Cố định theo số box',
        quantity: boxQuantity,
        rate: karaokeBoxRule.fixed,
        contribution: boxQuantity * karaokeBoxRule.fixed,
        unit: 'box',
      })

      hasValidInput = rows.some((row) => row.quantity > 0)

      totalA = rows.reduce((sum, row) => sum + row.contribution, 0)
      annualFee = totalA * baseSalary * activeRegion.multiplier
    } else if (isHotel) {
      rows = hotelRules.map((rule) => {
        const countRaw = Number.parseInt(hotelCounts[rule.key], 10)
        const quantity = Number.isFinite(countRaw) && countRaw > 0 ? countRaw : 0
        const contribution = quantity * rule.rate

        return {
          label: rule.label,
          range: 'Theo số lượng',
          quantity,
          rate: rule.rate,
          contribution,
          unit: 'phòng',
        }
      })

      hasValidInput = rows.some((row) => row.quantity > 0)

      totalA = rows.reduce((sum, row) => sum + row.contribution, 0)
      annualFee = totalA * baseSalary * activeRegion.multiplier
    } else {
      const parsedArea = Number.parseFloat(String(area).replace(',', '.'))
      safeArea = Number.isFinite(parsedArea) && parsedArea > 0 ? parsedArea : 0
      hasValidInput = safeArea > 0

      if (isCafe) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 15 m²',
            min: 0,
            max: 15,
            rate: cafeTier1Base / cafeTier1Limit,
          },
          {
            label: 'Bậc 2',
            range: '15 - 50 m²',
            min: 15,
            max: 50,
            rate: 0.04,
          },
          {
            label: 'Bậc 3',
            range: '> 50 m²',
            min: 50,
            max: Number.POSITIVE_INFINITY,
            rate: 0.02,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? cafeTier1Base * (quantity / cafeTier1Limit)
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, cafeCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else if (isRestaurant) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 50 m²',
            min: 0,
            max: 50,
            rate: restaurantTier1Base / restaurantTier1Limit,
          },
          {
            label: 'Bậc 2',
            range: '50 - 100 m²',
            min: 50,
            max: 100,
            rate: 0.05,
          },
          {
            label: 'Bậc 3',
            range: '> 100 m²',
            min: 100,
            max: Number.POSITIVE_INFINITY,
            rate: 0.03,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? restaurantTier1Base * (quantity / restaurantTier1Limit)
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, restaurantCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else if (isShop) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 50 m²',
            min: 0,
            max: 50,
            rate: shopTier1Base / shopTier1Limit,
          },
          {
            label: 'Bậc 2',
            range: '50 - 100 m²',
            min: 50,
            max: 100,
            rate: 0.008,
          },
          {
            label: 'Bậc 3',
            range: '> 100 m²',
            min: 100,
            max: Number.POSITIVE_INFINITY,
            rate: 0.006,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? shopTier1Base * (quantity / shopTier1Limit)
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, shopCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else if (isFitness) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 50 m²',
            min: 0,
            max: 50,
            rate: fitnessTier1Base / fitnessTier1Limit,
          },
          {
            label: 'Bậc 2',
            range: '50 - 100 m²',
            min: 50,
            max: 100,
            rate: 0.011,
          },
          {
            label: 'Bậc 3',
            range: '> 100 m²',
            min: 100,
            max: Number.POSITIVE_INFINITY,
            rate: 0.009,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? fitnessTier1Base * (quantity / fitnessTier1Limit)
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, fitnessCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else if (isBar) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 50 m²',
            min: 0,
            max: barTier1Limit,
            rate: barTier1Base / barTier1Limit,
          },
          {
            label: 'Bậc 2',
            range: '50 - 200 m²',
            min: barTier1Limit,
            max: barTier2Limit,
            rate: 0.06,
          },
          {
            label: 'Bậc 3',
            range: '> 200 m²',
            min: barTier2Limit,
            max: Number.POSITIVE_INFINITY,
            rate: 0.05,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? barTier1Base * (quantity / barTier1Limit)
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, barCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else if (isPlayground) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 200 m²',
            min: 0,
            max: playgroundTier1Limit,
            rate: playgroundTier1Base / playgroundTier1Limit,
          },
          {
            label: 'Bậc 2',
            range: '200 - 500 m²',
            min: playgroundTier1Limit,
            max: playgroundTier2Limit,
            rate: 0.003,
          },
          {
            label: 'Bậc 3',
            range: '> 500 m²',
            min: playgroundTier2Limit,
            max: Number.POSITIVE_INFINITY,
            rate: 0.001,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? playgroundTier1Base * (quantity / playgroundTier1Limit)
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, playgroundCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else if (isMall) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 200 m²',
            min: 0,
            max: mallTier1Limit,
            rate: mallTier1Base,
          },
          {
            label: 'Bậc 2',
            range: '200 - 500 m²',
            min: mallTier1Limit,
            max: mallTier2Limit,
            rate: 0.003,
          },
          {
            label: 'Bậc 3',
            range: '> 500 m²',
            min: mallTier2Limit,
            max: Number.POSITIVE_INFINITY,
            rate: 0.002,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? quantity > 0
                ? mallTier1Base
                : 0
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, mallCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else if (isSupermarket) {
        rows = [
          {
            label: 'Bậc 1',
            range: '0 - 500 m²',
            min: 0,
            max: supermarketTier1Limit,
            rate: supermarketTier1Base,
          },
          {
            label: 'Bậc 2',
            range: '500 - 1000 m²',
            min: supermarketTier1Limit,
            max: supermarketTier2Limit,
            rate: 0.003,
          },
          {
            label: 'Bậc 3',
            range: '> 1000 m²',
            min: supermarketTier2Limit,
            max: Number.POSITIVE_INFINITY,
            rate: 0.002,
          },
        ].map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)

          const contribution =
            rule.label === 'Bậc 1'
              ? quantity > 0
                ? supermarketTier1Base
                : 0
              : quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        rawTotalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        totalA = Math.min(rawTotalA, supermarketCap)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      } else {
        rows = tierRules.map((rule) => {
          const quantity = calculateTierQuantity(safeArea, rule.min, rule.max)
          const contribution = quantity * rule.rate

          return {
            ...rule,
            quantity,
            contribution,
            unit: 'm²',
          }
        })

        totalA = rows.reduce((sum, row) => sum + row.contribution, 0)
        annualFee = totalA * baseSalary * activeRegion.multiplier
      }
    }

    if (!hasValidInput) {
      setFeeResult(null)
      return
    }

    const vat = annualFee * vatRate
    const totalWithVat = annualFee + vat

    setFeeResult({
      safeArea,
      rows,
      totalA,
      annualFee,
      vat,
      totalWithVat,
      region: activeRegion,
      rawTotalA,
      isCafe,
      isRestaurant,
      isShop,
      isFitness,
      isBar,
      isPlayground,
      isMall,
      isSupermarket,
      isKaraoke,
      isHotel,
    })
  }

  return (
    <main className="page-shell">
      <section className="hero-card">
        <div className="hero-icon" aria-hidden="true">
          <DocumentIcon />
        </div>
        <div className="hero-copy">
          <h1>Biểu phí theo Nghị định 17/2023/NĐ-CP</h1>
          <p>
            Công thức phân bậc lũy tiến 3 tầng + trần phí. Áp dụng cho 10 loại hình kinh doanh theo Phụ lục 2.
          </p>
          <p>Số tiền bản quyền chi trả (tính theo năm) = Mức lương cơ sở × Hệ số điều chỉnh</p>
          <div className="hero-math">
            <span>F</span>
            <span>=</span>
            <span>MIN(A phân bậc, CAP) × B × M</span>
          </div>
        </div>
      </section>

      <section className="section-card chooser-card">
        <div className="section-head with-step">
          <span className="step-badge">1</span>
          <h2>Chọn loại hình cơ sở kinh doanh</h2>
        </div>

        <div className="business-grid" role="list" aria-label="Danh sách loại hình kinh doanh">
          {businessTypes.map((item) => {
            const active = item.id === selectedType

            return (
              <button
                key={item.id}
                type="button"
                className={`business-card ${active ? 'is-active' : ''}`}
                onClick={() => {
                  setSelectedType(item.id)
                  clearResult()
                }}
              >
                <span className="business-badge" aria-hidden="true">
                  <item.icon />
                </span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="section-card form-card">
        <div className="section-head with-step">
          <span className="step-badge">2</span>
          <h2>Nhập thông tin và tính phí</h2>
        </div>

        <div className="form-layout">
          <div className="field-group">
            <label className="field">
              <span>Vùng địa lý</span>
              <select
                value={selectedRegion}
                onChange={(event) => {
                  setSelectedRegion(event.target.value)
                  clearResult()
                }}
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.label} — {formatMultiplier(region.multiplier)}
                  </option>
                ))}
              </select>
            </label>

            {isKaraoke ? (
              <div className="karaoke-grid">
                <p className="room-group-title">Số lượng phòng</p>
                {karaokeRoomRules.map((rule) => (
                  <label className="field karaoke-field" key={rule.key}>
                    <span>
                      {rule.label} <em className="karaoke-hint">{rule.hint}</em>
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={karaokeCounts[rule.key]}
                      onFocus={clearResult}
                      onChange={(event) =>
                        setKaraokeCounts((prev) => ({
                          ...prev,
                          [rule.key]: event.target.value,
                        }))
                      }
                      onInput={clearResult}
                      placeholder="0"
                    />
                  </label>
                ))}
                <label className="field karaoke-field" key={karaokeBoxRule.key}>
                  <span>
                    {karaokeBoxRule.label} <em className="karaoke-hint">{karaokeBoxRule.hint}</em>
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={karaokeCounts[karaokeBoxRule.key]}
                    onFocus={clearResult}
                    onChange={(event) =>
                      setKaraokeCounts((prev) => ({
                        ...prev,
                        [karaokeBoxRule.key]: event.target.value,
                      }))
                    }
                    onInput={clearResult}
                    placeholder="0"
                  />
                </label>
              </div>
            ) : isHotel ? (
              <div className="karaoke-grid hotel-grid">
                <p className="room-group-title">Số lượng phòng</p>
                {hotelRules.map((rule) => (
                  <label className="field karaoke-field" key={rule.key}>
                    <span>
                      {rule.label} <em className="karaoke-hint">{rule.hint}</em>
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={hotelCounts[rule.key]}
                      onFocus={clearResult}
                      onChange={(event) =>
                        setHotelCounts((prev) => ({
                          ...prev,
                          [rule.key]: event.target.value,
                        }))
                      }
                      onInput={clearResult}
                      placeholder="0"
                    />
                  </label>
                ))}
                  <p className="karaoke-hint">
                    Dịch vụ khác trong khách sạn (nhà hàng, bar, karaoke, hồ bơi, gym, massage, spa, lobby, bãi xe,
                    khu mua sắm, vui chơi...) áp dụng theo nhóm loại hình tương ứng.
                  </p>
              </div>
            ) : (
              <label className="field">
                <span>Diện tích (m²)</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={area}
                  onFocus={clearResult}
                  onChange={(event) => {
                    setArea(event.target.value)
                    clearResult()
                  }}
                  placeholder="VD: 70"
                />
              </label>
            )}

            <button type="button" className="primary-action" onClick={handleCalculate}>
              Tính phí bản quyền
            </button>
          </div>
        </div>
      </section>

      {feeResult ? (
        <section className="fee-result-stack" aria-live="polite">
          <article className="fee-summary-card">
            <div className="fee-summary-body">
              <div className="fee-detail-card">
                <h4>Chi tiết tính phí</h4>
                <div className="calc-steps">
                  <div className="calc-step">
                    <span>Bước 1</span>
                    <p>
                      B (lương cơ sở) = <strong>{formatVndPlain(baseSalary)}</strong>
                    </p>
                  </div>

                  <div className="calc-step">
                    <span>Bước 2</span>
                    <p>
                      A (hệ số) = <strong>{formatNumber(feeResult.totalA)}</strong>
                    </p>
                    <p className="calc-step-sub">
                      {feeResult.isCafe
                        ? `A cộng theo 3 bậc riêng của quán cafe và chặn tối đa CAP = ${formatNumber(cafeCap)}.`
                        : feeResult.isRestaurant
                          ? `A cộng theo 3 bậc riêng của nhà hàng (0-50, 50-100, >100 m²) và chặn tối đa CAP = ${formatNumber(restaurantCap)}.`
                          : feeResult.isShop
                            ? `A cộng theo 3 bậc riêng của cửa hàng (0-50, 50-100, >100 m²) và chặn tối đa CAP = ${formatNumber(shopCap)}.`
                            : feeResult.isFitness
                              ? `A cộng theo 3 bậc riêng của câu lạc bộ thể dục (0-50, 50-100, >100 m²) và chặn tối đa CAP = ${formatNumber(fitnessCap)}.`
                              : feeResult.isBar
                                ? `A cộng theo 3 bậc riêng của quán bar (0-50, 50-200, >200 m²) và chặn tối đa CAP = ${formatNumber(barCap)}.`
                                : feeResult.isPlayground
                                  ? `A cộng theo 3 bậc riêng của khu vui chơi (0-200, 200-500, >500 m²) và chặn tối đa CAP = ${formatNumber(playgroundCap)}.`
                                  : feeResult.isMall
                                    ? `A cộng theo 3 bậc riêng của trung tâm thương mại: bậc 1 cố định 1,5 cho đến 200 m²; bậc 2 cộng 0,003/m²; bậc 3 cộng 0,002/m²; CAP = ${formatNumber(mallCap)}.`
                                    : feeResult.isSupermarket
                                      ? `A cộng theo 3 bậc riêng của siêu thị: bậc 1 cố định 1,25 cho đến 500 m²; bậc 2 cộng 0,003/m²; bậc 3 cộng 0,002/m²; CAP = ${formatNumber(supermarketCap)}.`
                                : feeResult.isHotel
                                  ? 'A của khách sạn được tính riêng theo số phòng và hạng sao (0,03 hoặc 0,02 mỗi phòng/năm).'
                          : 'A được cộng dồn từ bảng bậc bên dưới, sau đó lấy tổng để nhân với B.'}
                    </p>
                  </div>

                  <div className="calc-step">
                    <span>Bước 3</span>
                    <p>
                      M ({feeResult.region.id}) = <strong>{formatNumber(feeResult.region.multiplier, 2)}</strong>
                    </p>
                  </div>

                  <div className="calc-step calc-step-final">
                    <span>Bước 4</span>
                    <p>
                      F = {formatNumber(feeResult.totalA)} × {formatNumber(baseSalary, 0)} ×{' '}
                      {formatNumber(feeResult.region.multiplier, 2)} = <strong>{formatVnd(feeResult.annualFee)}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="fee-table-card">
                <table>
                  <thead>
                    <tr>
                      <th>Bậc</th>
                      <th>Khoảng</th>
                      <th>Số lượng</th>
                      <th>Hệ số/m²</th>
                      <th>Đóng góp A</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeResult.rows.map((row) => (
                      <tr key={row.label}>
                        <td><strong>{row.label}</strong></td>
                        <td>{row.range}</td>
                        <td>
                          {formatNumber(row.quantity)} {row.unit}
                        </td>
                        <td>{formatNumber(row.rate, 2)}</td>
                        <td><strong>{formatNumber(row.contribution)}</strong></td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td colSpan={4}>Tổng A</td>
                      <td><strong>{formatNumber(feeResult.totalA)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="fee-hero fee-hero-bottom">
                <p>Phí bản quyền năm (theo NĐ 17/2023)</p>
                <div className="fee-hero-sub">
                  <span>Số tiền: {formatVnd(feeResult.annualFee)}</span>
                  <span>Thuế GTGT 8%: {formatVnd(feeResult.vat)}</span>
                  <span className="fee-total-final">Tổng cần thanh toán: {formatVnd(feeResult.totalWithVat)}</span>
                </div>
              </div>
            </div>
          </article>
        </section>
      ) : null}

    </main>
  )
}

export default App
