import { useEffect, useRef, useState } from 'react'
import './App.css'
import logo from './assets/Appa-cmc-nen-toi.png'
import RegisterPage from './pages/RegisterPage'
import PerformancePage from './pages/PerformancePage'
import { cities, getWardsByCity, getActiveRegion } from './data/vietnamLocations'

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
      <path d="M7.1 7.2V4.8h9.8v2.4M8.2 10.1h2.6v2.6H8.2Zm5 0h2.6v2.6h-2.6ZM8.2 14h2.6v2.6H8.2Zm5 0h2.6v2.6h-2.6Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

const businessTypes = [
  { id: 'cafe', label: 'Quán café', icon: CafeIcon, capMultiplier: 8 },
  { id: 'restaurant', label: 'Nhà hàng, phòng hội thảo, hội nghị', icon: DiningIcon, capMultiplier: 8 },
  { id: 'shop', label: 'Cửa hàng, showroom', icon: ShopIcon, capMultiplier: 5 },
  { id: 'spa', label: 'CLB thể dục, SPA', icon: FitnessIcon, capMultiplier: 10 },
  { id: 'bar', label: 'Quán bar', icon: BarIcon, capMultiplier: 27 },
  { id: 'playground', label: 'Khu vui chơi', icon: PlayIcon, capMultiplier: 12 },
  { id: 'mall', label: 'Trung tâm thương mại', icon: MallIcon, capMultiplier: 50 },
  { id: 'supermarket', label: 'Siêu thị', icon: CartIcon, capMultiplier: 10 },
  { id: 'karaoke', label: 'Karaoke', icon: KaraokeIcon, capMultiplier: null },
  { id: 'hotel', label: 'Khách sạn', icon: HotelIcon, capMultiplier: null },
]

const appaContact = {
  address: 'Tòa W1 - Vinhomes Westpoint - Phường Từ Liêm - Hà Nội',
  phone: '0989115323',
}
const baseSalary = 2_530_000
const vatRate = 0.08

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

const paymentCycles = [
  { id: '6months', label: '6 tháng' },
  { id: '12months', label: '12 tháng' },
  { id: '24months', label: '24 tháng' },
  { id: '36months', label: '36 tháng' },
]

const formatNumber = (value, fractionDigits = 4) =>
  new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  }).format(value)

function calculateTierQuantity(area, min, max) {
  if (area <= min) return 0
  const upper = Number.isFinite(max) ? max : area
  return Math.min(area, upper) - min
}

function App() {
  const [activeView, setActiveView] = useState('performance')
  const [selectedType, setSelectedType] = useState(businessTypes[0].id)

  // Trụ sở doanh nghiệp
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedWard, setSelectedWard] = useState('')

  // Cơ sở kinh doanh
  const [storeCity, setStoreCity] = useState('')
  const [storeWard, setStoreWard] = useState('')
  const [selectedPaymentCycle, setSelectedPaymentCycle] = useState('')
  const [isAgreed, setIsAgreed] = useState(false)
  const [karaokeSubType, setKaraokeSubType] = useState('room')

  const [area, setArea] = useState('')
  const [karaokeCounts, setKaraokeCounts] = useState({
    roomSmall: '',
    roomMid: '',
    roomLarge: '',
    vipBox: '',
  })
  const [karaokeBoxCount, setKaraokeBoxCount] = useState('')
  const [hotelStar, setHotelStar] = useState('')
  const [hotelRooms, setHotelRooms] = useState('')
  const [feeResult, setFeeResult] = useState(null)

  // State quản lý việc mở modal Điều khoản sử dụng từ Footer
  const [isFooterTermsModalOpen, setIsFooterTermsModalOpen] = useState(false)

  const registerSectionRef = useRef(null)

  const activeRegion = getActiveRegion(storeCity, storeWard)
  const isRegisterView = activeView === 'register'
  const isKaraoke = selectedType === 'karaoke'
  const isHotel = selectedType === 'hotel'

  const currentBusinessType = businessTypes.find((b) => b.id === selectedType)

  const openRegistration = () => {
    const isOpening = !isRegisterView

    if (isOpening) {
      setStoreCity(selectedCity)
      setStoreWard(selectedWard)
    }

    setActiveView('register')

    if (isOpening) {
      requestAnimationFrame(() => {
        registerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  useEffect(() => {
    let rows = []
    let totalA = 0
    let rawTotalA = 0
    let annualFee = 0
    let safeArea = 0
    let hasValidInput = false

    const k = activeRegion?.multiplier ?? 1
    const kText = formatNumber(k, 2)

    if (isKaraoke) {
      if (karaokeSubType === 'box') {
        const boxRaw = Number.parseInt(karaokeBoxCount, 10)
        const boxQuantity = Number.isFinite(boxRaw) && boxRaw > 0 ? boxRaw : 0

        if (boxQuantity > 0) {
          rows = [
            {
              label: karaokeBoxRule.label,
              range: 'Box karaoke',
              quantity: boxQuantity,
              contribution: boxQuantity * karaokeBoxRule.fixed,
              formulaText: k !== 1
                ? `${boxQuantity} x ${formatNumber(karaokeBoxRule.fixed, 2)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
                : `${boxQuantity} x ${formatNumber(karaokeBoxRule.fixed, 2)} x ${formatNumber(baseSalary, 0)}`,
              unit: 'box',
            },
          ]
        }
      } else {
        rows = karaokeRoomRules.flatMap((rule) => {
          const countRaw = Number.parseInt(karaokeCounts[rule.key], 10)
          const totalRooms = Number.isFinite(countRaw) && countRaw > 0 ? countRaw : 0

          const tier1Qty = Math.min(totalRooms, 4)
          const tier2Qty = Math.max(Math.min(totalRooms, 10) - 4, 0)
          const tier3Qty = Math.max(totalRooms - 10, 0)

          return [
            {
              label: `${rule.label} (Phòng 1-4)`,
              range: 'Bậc 1-4 phòng',
              quantity: tier1Qty,
              contribution: tier1Qty * rule.coefficients[0],
              formulaText: k !== 1
                ? `${tier1Qty} x ${formatNumber(rule.coefficients[0], 2)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
                : `${tier1Qty} x ${formatNumber(rule.coefficients[0], 2)} x ${formatNumber(baseSalary, 0)}`,
              unit: 'phòng',
            },
            {
              label: `${rule.label} (Phòng 5-10)`,
              range: 'Bậc 5-10 phòng',
              quantity: tier2Qty,
              contribution: tier2Qty * rule.coefficients[1],
              formulaText: k !== 1
                ? `${tier2Qty} x ${formatNumber(rule.coefficients[1], 2)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
                : `${tier2Qty} x ${formatNumber(rule.coefficients[1], 2)} x ${formatNumber(baseSalary, 0)}`,
              unit: 'phòng',
            },
            {
              label: `${rule.label} (Phòng 11+)`,
              range: 'Bậc >10 phòng',
              quantity: tier3Qty,
              contribution: tier3Qty * rule.coefficients[2],
              formulaText: k !== 1
                ? `${tier3Qty} x ${formatNumber(rule.coefficients[2], 2)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
                : `${tier3Qty} x ${formatNumber(rule.coefficients[2], 2)} x ${formatNumber(baseSalary, 0)}`,
              unit: 'phòng',
            },
          ].filter(r => r.quantity > 0)
        })

        const boxRaw = Number.parseInt(karaokeCounts[karaokeBoxRule.key], 10)
        const boxQuantity = Number.isFinite(boxRaw) && boxRaw > 0 ? boxRaw : 0

        if (boxQuantity > 0) {
          rows.push({
            label: karaokeBoxRule.label,
            range: 'Box karaoke',
            quantity: boxQuantity,
            contribution: boxQuantity * karaokeBoxRule.fixed,
            formulaText: k !== 1
              ? `${boxQuantity} x ${formatNumber(karaokeBoxRule.fixed, 2)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
              : `${boxQuantity} x ${formatNumber(karaokeBoxRule.fixed, 2)} x ${formatNumber(baseSalary, 0)}`,
            unit: 'box',
          })
        }
      }

      hasValidInput = rows.length > 0
      totalA = rows.reduce((sum, row) => sum + row.contribution, 0)
      annualFee = totalA * baseSalary * k
    } else if (isHotel) {
      const starValue = Number.parseInt(hotelStar, 10)
      const roomRaw = Number.parseInt(hotelRooms, 10)
      const roomQuantity = Number.isFinite(roomRaw) && roomRaw > 0 ? roomRaw : 0
      const rule = starValue >= 4 ? hotelRules[0] : hotelRules[1]

      if (roomQuantity > 0 && Number.isFinite(starValue)) {
        rows = [
          {
            label: rule.label,
            range: 'Theo số lượng phòng',
            quantity: roomQuantity,
            contribution: roomQuantity * rule.rate,
            formulaText: k !== 1
              ? `${roomQuantity} x ${formatNumber(rule.rate, 2)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
              : `${roomQuantity} x ${formatNumber(rule.rate, 2)} x ${formatNumber(baseSalary, 0)}`,
            unit: 'phòng',
          },
        ]
      }

      hasValidInput = rows.length > 0
      totalA = rows.reduce((sum, row) => sum + row.contribution, 0)
      annualFee = totalA * baseSalary * k
    } else {
      const parsedArea = Number.parseFloat(String(area).replace(',', '.'))
      safeArea = Number.isFinite(parsedArea) && parsedArea > 0 ? parsedArea : 0
      hasValidInput = safeArea > 0

      let tierConfigs = []
      let cap = currentBusinessType?.capMultiplier || Number.POSITIVE_INFINITY

      switch (selectedType) {
        case 'cafe':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 15 m²', min: 0, max: 15, rate: 0.35, isFlatFirst: true },
            { label: 'Bậc 2', range: '15 - 50 m²', min: 15, max: 50, rate: 0.04 },
            { label: 'Bậc 3', range: '> 50 m²', min: 50, max: Number.POSITIVE_INFINITY, rate: 0.02 },
          ]
          break
        case 'restaurant':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 50 m²', min: 0, max: 50, rate: 2.0, isFlatFirst: true },
            { label: 'Bậc 2', range: '50 - 100 m²', min: 50, max: 100, rate: 0.05 },
            { label: 'Bậc 3', range: '> 100 m²', min: 100, max: Number.POSITIVE_INFINITY, rate: 0.03 },
          ]
          break
        case 'shop':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 50 m²', min: 0, max: 50, rate: 0.35, isFlatFirst: true },
            { label: 'Bậc 2', range: '50 - 100 m²', min: 50, max: 100, rate: 0.008 },
            { label: 'Bậc 3', range: '> 100 m²', min: 100, max: Number.POSITIVE_INFINITY, rate: 0.006 },
          ]
          break
        case 'spa':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 50 m²', min: 0, max: 50, rate: 0.5, isFlatFirst: true },
            { label: 'Bậc 2', range: '50 - 100 m²', min: 50, max: 100, rate: 0.011 },
            { label: 'Bậc 3', range: '> 100 m²', min: 100, max: Number.POSITIVE_INFINITY, rate: 0.009 },
          ]
          break
        case 'bar':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 50 m²', min: 0, max: 50, rate: 2.35, isFlatFirst: true },
            { label: 'Bậc 2', range: '50 - 200 m²', min: 50, max: 200, rate: 0.06 },
            { label: 'Bậc 3', range: '> 200 m²', min: 200, max: Number.POSITIVE_INFINITY, rate: 0.05 },
          ]
          break
        case 'playground':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 200 m²', min: 0, max: 200, rate: 0.7, isFlatFirst: true },
            { label: 'Bậc 2', range: '200 - 500 m²', min: 200, max: 500, rate: 0.003 },
            { label: 'Bậc 3', range: '> 500 m²', min: 500, max: Number.POSITIVE_INFINITY, rate: 0.001 },
          ]
          break
        case 'mall':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 200 m²', min: 0, max: 200, rate: 1.5, isFlatFirst: true },
            { label: 'Bậc 2', range: '200 - 500 m²', min: 200, max: 500, rate: 0.003 },
            { label: 'Bậc 3', range: '> 500 m²', min: 500, max: Number.POSITIVE_INFINITY, rate: 0.002 },
          ]
          break
        case 'supermarket':
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 500 m²', min: 0, max: 500, rate: 1.25, isFlatFirst: true },
            { label: 'Bậc 2', range: '500 - 1000 m²', min: 500, max: 1000, rate: 0.003 },
            { label: 'Bậc 3', range: '> 1000 m²', min: 1000, max: Number.POSITIVE_INFINITY, rate: 0.002 },
          ]
          break
        default:
          tierConfigs = [
            { label: 'Bậc 1', range: '0 - 15 m²', min: 0, max: 15, rate: 0.0233 },
            { label: 'Bậc 2', range: '15 - 50 m²', min: 15, max: 50, rate: 0.04 },
            { label: 'Bậc 3', range: '> 50 m²', min: 50, max: Number.POSITIVE_INFINITY, rate: 0.02 },
          ]
      }

      rows = tierConfigs.map((tier) => {
        const qty = calculateTierQuantity(safeArea, tier.min, tier.max)
        let contrib = 0
        let formula = ''

        if (tier.isFlatFirst) {
          contrib = qty > 0 ? tier.rate : 0
          if (qty > 0) {
            formula = k !== 1
              ? `${formatNumber(tier.rate, 2)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
              : `${formatNumber(tier.rate, 2)} x ${formatNumber(baseSalary, 0)}`
          } else {
            formula = '0 ₫'
          }
        } else {
          contrib = qty * tier.rate
          formula = k !== 1
            ? `${formatNumber(qty, 0)} x ${formatNumber(tier.rate, 4)} x ${formatNumber(baseSalary, 0)} x k(${kText})`
            : `${formatNumber(qty, 0)} x ${formatNumber(tier.rate, 4)} x ${formatNumber(baseSalary, 0)}`
        }

        return {
          label: tier.label,
          range: tier.range,
          quantity: qty,
          contribution: contrib,
          formulaText: formula,
          unit: 'm²',
        }
      })

      rawTotalA = rows.reduce((sum, r) => sum + r.contribution, 0)
      totalA = Math.min(rawTotalA, cap)
      annualFee = totalA * baseSalary * k
    }

    if (!hasValidInput) {
      setFeeResult(null)
      return
    }

    const baseAmount = totalA * baseSalary
    const vat = annualFee * vatRate
    const totalWithVat = annualFee + vat

    setFeeResult({
      safeArea,
      rows,
      totalA,
      baseAmount,
      annualFee,
      vat,
      totalWithVat,
      region: activeRegion,
      rawTotalA,
      capMultiplier: currentBusinessType?.capMultiplier || null,
    })
  }, [
    selectedType,
    currentBusinessType,
    karaokeSubType,
    karaokeCounts,
    karaokeBoxCount,
    hotelStar,
    hotelRooms,
    area,
    storeCity,
    storeWard,
    activeRegion,
    isKaraoke,
    isHotel,
  ])

  return (
    <main className="page-shell">
      <header className="app-header-bar" aria-label="Header điều hướng">
        <div className="app-brand" aria-label="Logo Appa CMC">
          <img src={logo} alt="Logo Appa CMC" className="app-brand-logo" />
        </div>

        <nav className="app-nav-menu">
          {[
            { id: 'register', label: 'CƠ SỞ KINH DOANH' },
            { id: 'performance', label: 'TỔ CHỨC BIỂU DIỄN' },
            // { id: 'copy', label: 'ĐĂNG KÝ SAO CHÉP' },
            // { id: 'lookup', label: 'TRA CỨU ĐĂNG KÝ' },
          ].map((tab) => {
            const isActive = activeView === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                className={`header-action ${isActive ? 'is-active' : ''}`}
                onClick={() => {
                  if (tab.id === 'register') {
                    openRegistration()
                  } else {
                    setActiveView(tab.id)
                  }
                  if (tab.id !== 'register') {
                    setIsAgreed(false)
                  }
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        <a
          href="https://www.appa.org.vn/"
          target="_blank"
          rel="noopener noreferrer"
          className="header-action header-action-primary"
        >
          Về trang chủ
          <span className="header-action-icon-arrow" aria-hidden="true">↗</span>
        </a>
      </header>

      {activeView === 'register' && (
        <>
          <section className="hero-card">
            <div className="hero-icon" aria-hidden="true">
              <DocumentIcon />
            </div>
            <div className="hero-copy">
              <h1>Biểu phí theo Nghị định 17/2023/NĐ-CP</h1>
              <p>Mức lương cơ sở: 2.530.000 ₫</p>
              <div className="hero-math">
                <span>Số tiền bản quyền chi trả (tính theo năm) = Mức lương cơ sở × Tỷ lệ áp dụng khung giá × k</span>
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
                      setIsAgreed(false)
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
        </>
      )}

      <div ref={registerSectionRef}>
        {isRegisterView ? (
          <RegisterPage
            selectedType={selectedType}
            currentBusinessType={currentBusinessType}
            selectedCity={selectedCity}
            selectedWard={selectedWard}
            setSelectedCity={setSelectedCity}
            setSelectedWard={setSelectedWard}
            storeCity={storeCity}
            storeWard={storeWard}
            setStoreCity={setStoreCity}
            setStoreWard={setStoreWard}
            area={area}
            setArea={setArea}
            selectedPaymentCycle={selectedPaymentCycle}
            setSelectedPaymentCycle={setSelectedPaymentCycle}
            isAgreed={isAgreed}
            setIsAgreed={setIsAgreed}
            cities={cities}
            getWardsByCity={getWardsByCity}
            paymentCycles={paymentCycles}
            karaokeRoomRules={karaokeRoomRules}
            karaokeBoxRule={karaokeBoxRule}
            karaokeCounts={karaokeCounts}
            setKaraokeCounts={setKaraokeCounts}
            karaokeSubType={karaokeSubType}
            setKaraokeSubType={setKaraokeSubType}
            karaokeBoxCount={karaokeBoxCount}
            setKaraokeBoxCount={setKaraokeBoxCount}
            hotelStar={hotelStar}
            setHotelStar={setHotelStar}
            hotelRooms={hotelRooms}
            setHotelRooms={setHotelRooms}
            feeResult={feeResult}
          />
        ) : activeView === 'performance' ? (
          <PerformancePage />
        ) : null}
      </div>

      <footer className="app-footer" aria-label="Thông tin liên hệ APPA-CMC">
        <div className="app-footer-inner">
          <p className="app-footer-brand">
            Trung tâm Khai thác Quyền biểu diễn Âm nhạc Việt Nam
            <br />
            Trực thuộc Hội Bảo vệ quyền của nghệ sĩ biểu diễn âm nhạc Việt Nam
          </p>

          <div className="app-footer-contacts">
            <div className="app-footer-contact-chip">
              <span className="app-footer-chip-label">Địa chỉ</span>
              <span className="app-footer-chip-value">{appaContact.address}</span>
            </div>
            <a className="app-footer-contact-chip" href={`tel:${appaContact.phone.replace(/\s+/g, '')}`}>
              <span className="app-footer-chip-label">Hotline</span>
              <span className="app-footer-chip-value">{appaContact.phone}</span>
            </a>
            <a className="app-footer-contact-chip" href="mailto:cmc@appa.org.vn">
              <span className="app-footer-chip-label">Email</span>
              <span className="app-footer-chip-value">cmc@appa.org.vn</span>
            </a>
          </div>

          <div style={{ textAlign: 'center', marginTop: '14px' }}>
            <button
              type="button"
              onClick={() => setIsFooterTermsModalOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#93c5fd',
                fontSize: '0.9rem',
                fontWeight: '600',
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: '4px 8px',
              }}
            >
              Điều khoản sử dụng
            </button>
          </div>

          <p className="app-footer-brand-1">Bản quyền dữ liệu thuộc về VK Entertainment JSC.</p>
        </div>
      </footer>

      {isFooterTermsModalOpen && (
        <div className="register-terms-modal consent-modal-overlay" onClick={() => setIsFooterTermsModalOpen(false)}>
          <div className="consent-modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="consent-modal-header-badge">
              ĐIỀU KHOẢN DỊCH VỤ VÀ CAM KẾT SỬ DỤNG
            </div>

            <div className="consent-modal-card">
              <div className="consent-modal-scrollable">
                <p className="terms-meta-line"><strong>Phiên bản:</strong> v2</p>
                <p className="terms-meta-line"><strong>Hiệu lực từ:</strong> 02/10/2025</p>
                <p className="terms-meta-line">
                  <strong>Đơn vị quản lý:</strong> Trung tâm Khai thác Quyền biểu diễn âm nhạc Việt Nam (APPA-CMC)
                </p>

                <p className="terms-paragraph">
                  Bằng việc tích chọn chấp thuận, đăng ký và cung cấp thông tin trên hệ thống, Đơn vị sử
                  dụng xác nhận đã đọc, hiểu và đồng ý chịu sự ràng buộc của toàn bộ các Điều khoản và
                  Cam kết dưới đây:
                </p>

                <h4 className="terms-section-title">ĐIỀU 1: ĐỊNH NGHĨA VÀ PHẠM VI ÁP DỤNG</h4>
                <p className="terms-paragraph">
                  1.1. <strong>"Trung tâm" / "APPA-CMC":</strong> Trung tâm Khai thác Quyền biểu diễn Âm nhạc Việt Nam, tổ chức đại diện tập thể quyền liên quan trực thuộc Hội Bảo vệ quyền của nghệ sĩ biểu diễn âm nhạc Việt Nam (thành lập theo quyết định số 1813/QĐ-BNV ngày 01 tháng 12 năm 2015).
                </p>
                <p className="terms-paragraph">
                  1.2. <strong>"Đơn vị sử dụng" / "Người đăng ký" / "Khách hàng":</strong> Tổ chức, cá nhân, hộ kinh doanh thực hiện đăng ký, kê khai thông tin và sử dụng dịch vụ cấp phép quyền liên quan qua hệ thống của Trung tâm.
                </p>
                <p className="terms-paragraph">
                  1.3. <strong>"Quyền liên quan":</strong> Quyền của nghệ sĩ biểu diễn âm nhạc đối với bản ghi đã công bố, theo quy định của Luật Sở hữu trí tuệ và Nghị định 17/2023/NĐ-CP, Nghị định số 134/2026/NĐ-CP.
                </p>
                <p className="terms-paragraph">
                  1.4. <strong>"Giấy chứng nhận cấp phép":</strong> Văn bản (kèm mã QR xác minh) do Trung tâm phát hành, xác nhận Đơn vị sử dụng / Người đăng ký đã được cấp phép sử dụng Quyền liên quan đối với bản ghi trong phạm vi và thời hạn ghi trên giấy.
                </p>
                <p className="terms-paragraph">
                  1.5 <strong>Phạm vi áp dụng:</strong> Điều khoản này áp dụng cho toàn bộ các loại hình cấp phép do Trung tâm cung cấp, bao gồm nhưng không giới hạn:
                  <br />- Cơ sở kinh doanh thương mại theo danh mục quy định tại Nghị định số 17/2023/NĐ-CP
                  <br />- Phát sóng (phát thanh, truyền hình) theo danh mục quy định tại Nghị định số 134/2026/NĐ-CP
                  <br />- Hoạt động tổ chức biểu diễn có bán vé hoặc không bán vé
                </p>

                <h4 className="terms-section-title">ĐIỀU 2: PHẠM VI CẤP PHÉP VÀ LƯU Ý QUAN TRỌNG VỀ QUYỀN TÁC GIẢ</h4>
                <p className="terms-paragraph">
                  2.1. <strong>Phạm vi cấp phép:</strong> Giấy chứng nhận do Trung tâm cấp chỉ bao gồm Quyền liên quan của người biểu diễn âm nhạc đối với các bản ghi được công bố và đã được ủy quyền cho Trung tâm, và các bản ghi Trung tâm đại diện thu thay chủ sở hữu quyền liên quan.
                </p>
                <p className="terms-paragraph">
                  2.2. <strong>Không bao gồm Quyền tác giả:</strong> Giấy chứng nhận này KHÔNG BAO GỒM QUYỀN TÁC GIẢ (quyền đối với tác phẩm âm nhạc — giai điệu, lời) và KHÔNG BAO GỒM QUYỀN BẢN GHI. Quyền tác giả do Trung tâm Bảo vệ Quyền tác giả Âm nhạc Việt Nam (VCPMC) đại diện quản lý. Quyền bản ghi do Hiệp hội Công nghiệp Ghi âm Việt Nam (RIAV) đại diện quản lý.
                </p>
                <p className="terms-paragraph">
                  2.3. <strong>Nghĩa vụ độc lập của Đơn vị sử dụng / Người đăng ký:</strong>
                  <br />- Đơn vị sử dụng / Người đăng ký có nghĩa vụ tự liên hệ với VCPMC, RIAV hoặc chủ sở hữu quyền tương ứng của tác phẩm để được cấp phép quyền tác giả, quyền bản ghi trước khi sử dụng.
                  <br />- Việc sử dụng bản ghi âm/ghi hình mà không có đủ các chứng nhận cấp phép của các loại quyền có thể bị xử lý vi phạm theo quy định của pháp luật về sở hữu trí tuệ.
                </p>
                <p className="terms-paragraph">
                  2.4. <strong>Tính độc lập của khoản phí:</strong> Theo Phụ lục II Nghị định 17/2023/NĐ-CP, và Phụ lục I Nghị định 134/2026/NĐ-CP, biểu giá tiền bản quyền áp dụng tương tự cho chủ sở hữu quyền tác giả và chủ sở hữu quyền liên quan. Hai khoản thu này là độc lập và song song; khoản phí trả cho Trung tâm không thay thế và không bao gồm khoản phí phải trả cho VCPMC và RIAV.
                </p>
                <p className="terms-paragraph">
                  2.5 <strong>Miễn trừ trách nhiệm:</strong> Trung tâm không chịu trách nhiệm đối với bất kỳ khiếu nại, tranh chấp hay chế tài pháp lý nào phát sinh từ việc Đơn vị sử dụng / Người đăng ký không thực hiện nghĩa vụ thanh toán quyền tác giả cho VCPMC và RIAV.
                </p>

                <h4 className="terms-section-title">ĐIỀU 3: CƠ CHẾ TỰ KÊ KHAI VÀ TRÁCH NHIỆM CỦA ĐƠN VỊ SỬ DỤNG / NGƯỜI ĐĂNG KÝ</h4>
                <p className="terms-paragraph">
                  3.1. <strong>Cơ chế tự kê khai:</strong> Hệ thống cấp phép của Trung tâm hoạt động hoàn toàn theo cơ chế tự kê khai, tự chịu trách nhiệm. Trung tâm không thực hiện thẩm định thực địa tại thời điểm cấp phép.
                </p>
                <p className="terms-paragraph">
                  3.2. <strong>Cam kết tính chính xác và hợp pháp:</strong>
                  <br />- Đơn vị sử dụng / Người đăng ký cam kết toàn bộ thông tin, tài liệu và nội dung kê khai trong hồ sơ đăng ký là đầy đủ, chính xác, trung thực và hợp pháp.
                  <br />- Thông tin kê khai bao gồm nhưng không giới hạn: loại hình kinh doanh, diện tích, số phòng, số ghế, số kênh, số lượt hành khách, quy mô sự kiện, danh sách bản ghi sử dụng và các thông số dùng để định giá.
                  <br />- Mức phí cấp phép được hệ thống tính tự động theo công thức quy định tại Nghị định 17/2023/NĐ-CP và biểu giá của Trung tâm dựa trên thông tin Đơn vị sử dụng / Người đăng ký đã tự cung cấp.
                </p>
                <p className="terms-paragraph">
                  3.3. <strong>Tuân thủ quyền sở hữu trí tuệ:</strong> Đơn vị sử dụng / Người đăng ký cam kết các nội dung cung cấp, đăng ký không xâm phạm quyền tác giả, quyền liên quan, quyền của người biểu diễn, quyền của nhà sản xuất bản ghi và các quyền, lợi ích hợp pháp khác của bất kỳ tổ chức, cá nhân nào.
                </p>
                <p className="terms-paragraph">
                  3.4. <strong>Trách nhiệm và Chế tài khi kê khai sai:</strong> Trường hợp kê khai sai, thiếu, giả mạo hoặc gian lận dẫn đến mức phí cấp phép thấp hơn mức thực tế phải nộp, Đơn vị sử dụng / Người đăng ký phải tự chịu trách nhiệm trước pháp luật và có nghĩa vụ:
                  <br />a) Nộp bổ bổ sung đầy đủ phần phí chênh lệch;
                  <br />b) Nộp tiền lãi chậm nộp tính trên phần chênh lệch theo ngày, áp dụng mức lãi suất chậm nộp theo quy định pháp luật về quản lý thuế;
                  <br />c) Chịu xử phạt vi phạm hành chính từ 10.000.000 VNĐ đến 30.000.000 VNĐ cho mỗi lần vi phạm theo Nghị định 131/2013/NĐ-CP và các văn bản sửa đổi, bổ sung.
                </p>
                <p className="terms-paragraph">
                  3.5. <strong>Xử lý vi phạm sau cấp phép:</strong> Việc phát hiện kê khai sai có thể diễn ra ở bất kỳ thời điểm nào (kể cả sau khi đã cấp Giấy chứng nhận) thông qua hoạt động kiểm tra của Trung tâm hoặc cơ quan chức năng. Giấy chứng nhận cấp dựa trên thông tin sai lệch có thể bị thu hồi mà không hoàn phí.
                </p>
                <p className="terms-paragraph">
                  3.6. <strong>Trách nhiệm hợp tác:</strong> Đơn vị sử dụng / Người đăng ký có trách nhiệm hợp tác, cung cấp đầy đủ hồ sơ, chứng từ khi Trung tâm hoặc cơ quan nhà nước có thẩm quyền yêu cầu xác minh.
                </p>

                <h4 className="terms-section-title">ĐIỀU 4: QUY TRÌNH ĐĂNG KÝ, THANH TOÁN VÀ CẤP PHÉP</h4>
                <p className="terms-paragraph">
                  4.1. <strong>Quy trình 07 bước:</strong>
                  <br />(1) Chọn loại hình cấp phép &rarr; (2) Kê khai thông tin pháp lý của đơn vị sử dụng &rarr; (3) Chấp thuận Điều khoản sử dụng &rarr; (4) Trung tâm duyệt đăng ký và hướng dẫn thanh toán &rarr; (5) Đơn vị sử dụng thanh toán tiền bản quyền &rarr; (6) Trung tâm xác nhận thanh toán &rarr; (7) Cấp Giấy chứng nhận.
                </p>
                <p className="terms-paragraph">
                  4.2. <strong>Thời hạn duyệt đăng ký:</strong> Sau khi tạo đơn, Trung tâm sẽ duyệt thông tin và gửi email kèm hướng dẫn thanh toán trong 72 giờ. Đơn vị đăng ký có thể tra cứu tình trạng xử lý hồ sơ trên trang đăng ký của Trung tâm.
                </p>
                <p className="terms-paragraph">
                  4.3. <strong>Thời gian xử lý cấp phép:</strong> Sau khi Đơn vị sử dụng / Người đăng ký chuyển khoản và tải lên chứng từ thanh toán, Trung tâm sẽ xác minh và phát hành Giấy chứng nhận trong vòng 48 giờ làm việc. Giấy chứng nhận được cấp vào ngày thanh toán được ghi nhận thành công trên tài khoản ngân hàng của Trung tâm.
                </p>
                <p className="terms-paragraph">
                  4.4. <strong>Quyền từ chối/hủy đơn của Trung tâm:</strong> Trung tâm có quyền kiểm tra hồ sơ và từ chối tiếp nhận hoặc hủy đơn (có gửi thông báo qua email) trong các trường hợp: không nhận được thanh toán, chứng từ không hợp lệ, thông tin kê khai mâu thuẫn/không đáp ứng điều kiện hoặc có dấu hiệu vi phạm pháp luật.
                </p>
                <p className="terms-paragraph">
                  4.5. <strong>Kiểm soát tính chính xác của phí:</strong> Mức phí sẽ được hệ thống máy chủ tự động tính toán lại ngay trước khi phát hành liên kết thanh toán nhằm bảo đảm tính chính xác và chống can thiệp. Mức phí cuối cùng có giá trị áp dụng là mức phí do máy chủ xác định.
                </p>

                <h4 className="terms-section-title">ĐIỀU 5: THỜI HẠN, GIA HẠN VÀ THAY ĐỔI NGUỒN CẤP PHÉP</h4>
                <p className="terms-paragraph">
                  5.1. <strong>Thời hạn Giấy chứng nhận:</strong> Giấy chứng nhận có giá trị trong thời hạn ghi rõ trên văn bản (theo năm hoặc theo quý tùy loại hình và lựa chọn đăng ký). Trung tâm sẽ gửi email nhắc gia hạn trước khi hết hạn 30 ngày.
                </p>
                <p className="terms-paragraph">
                  5.2. <strong>Cấp phép một lần:</strong> Đối với các loại hình cấp phép sự kiện biểu diễn, sự kiện doanh nghiệp, phim ảnh,... Giấy chứng nhận chỉ có giá trị cho duy nhất 01 lần sử dụng/sự kiện đã kê khai.
                </p>
                <p className="terms-paragraph">
                  5.3. <strong>Quản lý dữ liệu lịch sử:</strong> Dữ liệu lịch sử cấp phép được lưu trữ vĩnh viễn trên hệ thống.
                </p>

                <h4 className="terms-section-title">ĐIỀU 6: QUYỀN CUNG CẤP VÀ PHÂN CHIA TIỀN BẢN QUYỀN</h4>
                <p className="terms-paragraph">
                  6.1. <strong>Quyền sử dụng thông tin của Trung tâm:</strong> Đơn vị sử dụng / Người đăng ký đồng ý cho Trung tâm sử dụng các thông tin, tài liệu đã cung cấp nhằm mục đích tiếp nhận, thẩm định, xử lý hồ sơ, cấp phép, đối soát, phân chia tiền bản quyền và thực hiện các nghĩa vụ pháp lý liên quan.
                </p>
                <p className="terms-paragraph">
                  6.2. <strong>Phân chia tiền bản quyền:</strong> Tiền bản quyền thu được từ Đơn vị sử dụng / Người đăng ký, sau khi trừ phí quản lý theo Quy chế phí quản lý của Trung tâm, sẽ được phân chia theo quy định tại Quy chế phân phối tiền bản quyền cho chủ sở hữu bản ghi và người biểu diễn dựa trên căn cứ tính toán dữ liệu sử dụng.
                </p>
                <p className="terms-paragraph">
                  6.3. <strong>Trách nhiệm với Người biểu diễn:</strong> Trách nhiệm bảo đảm quyền của người biểu diễn trong các bản ghi do hội viên ủy quyền thuộc về hội viên đó (trừ trường hợp có thỏa thuận khác bằng văn bản).
                </p>

                <h4 className="terms-section-title">ĐIỀU 7: BẢO MẬT VÀ GIẢI QUYẾT TRANH CHẤP</h4>
                <p className="terms-paragraph">
                  7.1. <strong>Bảo mật dữ liệu:</strong> Trung tâm cam kết bảo mật thông tin do Đơn vị sử dụng / Người đăng ký cung cấp theo quy định pháp luật, trừ trường hợp phải cung cấp theo yêu cầu của cơ quan nhà nước có thẩm quyền.
                </p>
                <p className="terms-paragraph">
                  7.2. <strong>Tranh chấp với bên thứ ba:</strong> Trong trường hợp xảy ra tranh chấp giữa Đơn vị sử dụng / Người đăng ký và bên thứ ba liên quan đến quyền sở hữu quyền liên quan, Trung tâm chỉ có trách nhiệm cung cấp thông tin lịch sử cấp phép và các số liệu liên quan; các bên tranh chấp có trách nhiệm tự giải quyết với nhau.
                </p>
                <p className="terms-paragraph">
                  7.3. <strong>Luật áp dụng và Cơ quan giải quyết:</strong> Điều khoản này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết trước tiên thông qua thương lượng. Trường hợp thương lượng không thành, tranh chấp sẽ được đưa ra giải quyết tại Tòa án có thẩm quyền tại Việt Nam.
                </p>

                <h4 className="terms-section-title">ĐIỀU 8: ĐIỀU KHOẢN CHUNG</h4>
                <p className="terms-paragraph">
                  8.1. <strong>Sửa đổi, bổ bổ sung:</strong> Trung tâm có quyền cập nhật, sửa đổi Điều khoản này khi cần thiết. Phiên bản áp dụng đối với Đơn vị sử dụng / Người đăng ký là phiên bản được hiển thị trên hệ thống tại thời điểm Đơn vị sử dụng / Người đăng ký nhấn chấp thuận và tạo đơn thành công.
                </p>
                <p className="terms-paragraph">
                  8.2. <strong>Giá trị giao kết:</strong> Việc Đơn vị sử dụng / Người đăng ký đánh dấu (check) vào ô chấp thuận và tiếp tục quy trình kê khai/đăng ký được xác nhận là đã hiểu rõ và hoàn toàn đồng ý với toàn bộ nội dung của Điều khoản sử dụng và cam kết thực hiện các nghĩa vụ quy định tại Điều khoản này. Việc đồng ý này bao gồm cung cấp các thông tin về kỹ thuật cần thiết để làm bằng chứng chấp thuận Điều khoản, bao gồm nhưng không giới hạn ở địa chỉ IP, User-Agent, thời gian chính xác, vị trí, tọa độ, thiết bị.
                </p>
              </div>
            </div>

            <div className="consent-modal-footer">
              <button
                type="button"
                className="btn-register-submit"
                onClick={() => setIsFooterTermsModalOpen(false)}
                style={{ minWidth: '120px', height: '40px', fontSize: '0.88rem' }}
              >
                ĐÓNG
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default App