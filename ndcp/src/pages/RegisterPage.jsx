import { useRef, useState } from 'react'
import checkCircle from '../assets/Check-circle.png'

// NHẬP URL GOOGLE APPS SCRIPT ĐÃ DEPLOY TẠI ĐÂY
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzD7AVwQoWvYkUyzHGVM9XFqvwAm8cX5C_kkn_MExe7u_S0EE-H7xsYJvw6JLrBB5ks/exec";

const businessTypeAbbreviations = {
  cafe: 'CF',
  restaurant: 'NH',
  shop: 'CH',
  spa: 'SPA',
  bar: 'BAR',
  playground: 'KVC',
  mall: 'TTTM',
  supermarket: 'ST',
  hotel: 'KS',
}

const karaokeSubTypeAbbreviations = {
  room: 'KRP',
  box: 'KRB',
}

function formatRegistrationTime(date) {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}-${month}-${year}`
}

function getNextDailyOrderNumber(date) {
  const dateKey = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const storageKey = `ndcp_daily_order_${dateKey}`

  let nextCount = 1
  try {
    nextCount = Number(window.localStorage.getItem(storageKey) || '0') + 1
    window.localStorage.setItem(storageKey, String(nextCount))
  } catch {}

  return String(nextCount).padStart(3, '0')
}

function RegisterPage({
  businessTypes,
  selectedType,
  setSelectedType,
  currentBusinessType,
  selectedCity,
  selectedWard,
  setSelectedCity,
  setSelectedWard,
  storeCity,
  storeWard,
  setStoreCity,
  setStoreWard,
  selectedPaymentCycle,
  setSelectedPaymentCycle,
  isAgreed,
  setIsAgreed,
  clearResult,
  cities,
  getWardsByCity,
  paymentCycles,
  karaokeSubType,
  setKaraokeSubType,
}) {
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [hasReadConsent, setHasReadConsent] = useState(false)
  const [modalConsentChecked, setModalConsentChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State các trường thông tin Form
  const [companyName, setCompanyName] = useState('')
  const [taxCode, setTaxCode] = useState('')
  const [companyStreet, setCompanyStreet] = useState('')
  const [legalRepresentative, setLegalRepresentative] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  
  const [storeName, setStoreName] = useState('')
  const [storeStreet, setStoreStreet] = useState('')
  const [area, setArea] = useState('')
  const [hotelStar, setHotelStar] = useState('')
  const [hotelRooms, setHotelRooms] = useState('')
  const [karaokeBoxCount, setKaraokeBoxCount] = useState('')

  const [karaokeRoomRows, setKaraokeRoomRows] = useState([
    { area: '', count: '' },
  ])
  const [registrationInfo, setRegistrationInfo] = useState(null)
  const consentTermsRef = useRef(null)

  const handleSubmitRegister = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const abbreviation =
      selectedType === 'karaoke'
        ? karaokeSubTypeAbbreviations[karaokeSubType] ?? 'KR'
        : businessTypeAbbreviations[selectedType] ?? 'KH'
    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    const now = new Date()
    const orderNumber = getNextDailyOrderNumber(now)
    const registrationCode = `APPA-CMC-${abbreviation}-${randomNumber}-${orderNumber}`

    const cityName = cities.find(c => c.id === selectedCity)?.name || ''
    const wardName = getWardsByCity(selectedCity).find(w => w.id === selectedWard)?.name || ''
    const fullCompanyAddress = `${companyStreet}${companyStreet ? ', ' : ''}${wardName}${wardName ? ', ' : ''}${cityName}`

    const storeCityName = cities.find(c => c.id === storeCity)?.name || ''
    const storeWardName = getWardsByCity(storeCity).find(w => w.id === storeWard)?.name || ''
    const fullStoreAddress = `${storeStreet}${storeStreet ? ', ' : ''}${storeWardName}${storeWardName ? ', ' : ''}${storeCityName}`

    let scaleDetails = ''
    if (selectedType === 'karaoke' && karaokeSubType === 'room') {
      scaleDetails = karaokeRoomRows.map(r => `Diện tích: ${r.area}m2, Số phòng: ${r.count}`).join(' | ')
    } else if (selectedType === 'karaoke' && karaokeSubType === 'box') {
      scaleDetails = `Số Karaoke Box: ${karaokeBoxCount}`
    } else if (selectedType === 'hotel') {
      scaleDetails = `Hạng sao: ${hotelStar}, Số phòng: ${hotelRooms}`
    } else {
      scaleDetails = `Diện tích: ${area} m2`
    }

    const payload = {
      registrationCode,
      businessType: selectedType,
      businessTypeLabel: currentBusinessType?.label || selectedType,
      karaokeSubType: selectedType === 'karaoke' ? karaokeSubType : '',
      companyName,
      taxCode,
      companyAddress: fullCompanyAddress,
      legalRepresentative: legalRepresentative.trim(),
      phone,
      email,
      storeName,
      storeAddress: fullStoreAddress,
      paymentCycle: paymentCycles.find(p => p.id === selectedPaymentCycle)?.label || selectedPaymentCycle,
      scaleDetails
    }

    try {
      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
    } catch (err) {
      console.error("Lỗi gửi dữ liệu về Apps Script:", err)
    } finally {
      setIsSubmitting(false)
      setRegistrationInfo({
        code: registrationCode,
        registrantName: legalRepresentative.trim(),
        time: formatRegistrationTime(now),
      })
      setIsSuccessModalOpen(true)
    }
  }

  const handleRoomRowChange = (index, field, value) => {
    setKaraokeRoomRows((prev) =>
      prev.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    )
  }

  const handleAddKaraokeRoomRow = () => {
    setKaraokeRoomRows((prev) => [...prev, { area: '', count: '' }])
  }

  const handleRemoveKaraokeRoomRow = (index) => {
    setKaraokeRoomRows((prev) => {
      if (prev.length === 1) return [{ area: '', count: '' }]
      return prev.filter((_, rowIndex) => rowIndex !== index)
    })
  }

  const handleOpenConsentModal = () => {
    setHasReadConsent(false)
    setModalConsentChecked(false)
    setIsConsentModalOpen(true)
  }

  const handleScrollConsent = () => {
    const el = consentTermsRef.current
    if (!el) return
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8
    if (isAtBottom) setHasReadConsent(true)
  }

  const handleModalConsentChange = (event) => {
    const checked = event.target.checked
    if (!hasReadConsent || !checked) return
    setModalConsentChecked(true)
    setIsAgreed(true)
    setIsConsentModalOpen(false)
    setHasReadConsent(false)
  }

  const resetConsent = () => {
    setIsAgreed(false)
    setIsConsentModalOpen(false)
    setHasReadConsent(false)
    setModalConsentChecked(false)
  }

  return (
    <div className="register-page-shell">
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
                  resetConsent()
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

      <section className="register-panel-card">
        <div className="register-section">
          <div className="register-section-head">
            <span className="register-step-number">01</span>
            <h3>LOẠI HÌNH KINH DOANH</h3>
          </div>

          <div className="register-input-wrap">
            <span className="register-field-label">Loại hình kinh doanh đã chọn</span>

            {selectedType === 'karaoke' ? (
              <div className="register-karaoke-select-box">
                <select
                  value={karaokeSubType}
                  onChange={(event) => {
                    setKaraokeSubType(event.target.value)
                    clearResult()
                  }}
                >
                  <option value="room">Cơ sở kinh doanh dv karaoke phòng</option>
                  <option value="box">Cơ sở kinh doanh dv karaoke box</option>
                </select>
              </div>
            ) : (
              <div className="register-select-box">
                <span>{currentBusinessType?.label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="register-panel-card">
        <div className="register-section">
          <div className="register-section-head">
            <span className="register-step-number">02</span>
            <h3>THÔNG TIN DOANH NGHIỆP</h3>
          </div>

          <div className="business-form-container">
            <div className="business-form-grid">
              <div className="business-form-field">
                <label className="business-form-label">
                  Tên doanh nghiệp/Hộ kinh doanh <span className="required-star">*</span>
                </label>
                <div className="business-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Nhập tên doanh nghiệp/Hộ kinh doanh" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
              </div>

              <div className="business-form-field">
                <label className="business-form-label">
                  MST <span className="required-star">*</span>
                </label>
                <div className="business-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Nhập MST" 
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                  />
                </div>
              </div>

              <div className="business-form-field full-width">
                <label className="business-form-label">
                  Địa chỉ trụ sở <span className="required-star">*</span>
                </label>

                <div className="business-address-row">
                  <div className="business-input-wrapper select-wrapper">
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        const cityId = e.target.value
                        setSelectedCity(cityId)
                        setSelectedWard(getWardsByCity(cityId)[0]?.id ?? '')
                      }}
                    >
                      <option value="" disabled hidden>Chọn tỉnh/thành phố</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="business-input-wrapper select-wrapper">
                    <select
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                    >
                      <option value="" disabled hidden>Chọn phường/xã</option>
                      {getWardsByCity(selectedCity).map((ward) => (
                        <option key={ward.id} value={ward.id}>
                          {ward.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="business-address-street">
                  <div className="business-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập số nhà, tên đường" 
                      value={companyStreet}
                      onChange={(e) => setCompanyStreet(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="business-form-field full-width">
                <label className="business-form-label">
                  Người đại diện pháp luật <span className="required-star">*</span>
                </label>
                <div className="business-input-wrapper">
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={legalRepresentative}
                    onChange={(e) => setLegalRepresentative(e.target.value)}
                  />
                </div>
              </div>

              <div className="business-form-field">
                <label className="business-form-label">
                  Số điện thoại liên hệ <span className="required-star">*</span>
                </label>
                <div className="business-phone-group">
                  <div className="business-input-wrapper phone-prefix-wrapper select-wrapper">
                    <select defaultValue="+84">
                      <option value="+84">+84</option>
                    </select>
                  </div>
                  <div className="business-input-wrapper phone-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập số điện thoại" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="business-form-field">
                <label className="business-form-label">
                  Email liên hệ <span className="required-star">*</span>
                </label>
                <div className="business-input-wrapper">
                  <input 
                    type="email" 
                    placeholder="Nhập email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="register-panel-card">
        <div className="register-section">
          <div className="register-section-head">
            <span className="register-step-number">03</span>
            <h3>THÔNG TIN CƠ SỞ KINH DOANH</h3>
          </div>
          <p className="business-sub-desc">Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.</p>

          <div className="business-form-container">
            {selectedType === 'karaoke' && karaokeSubType === 'room' ? (
              <div className="karaoke-room-form-wrapper">
                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Tên cơ sở kinh doanh <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập tên cơ sở kinh doanh" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Địa chỉ cơ sở kinh doanh <span className="required-star">*</span>
                  </label>

                  <div className="business-address-row">
                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeCity}
                        onChange={(e) => {
                          const cityId = e.target.value
                          setStoreCity(cityId)
                          setStoreWard(getWardsByCity(cityId)[0]?.id ?? '')
                        }}
                      >
                        <option value="" disabled hidden>Chọn tỉnh/thành phố</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeWard}
                        onChange={(e) => setStoreWard(e.target.value)}
                      >
                        <option value="" disabled hidden>Chọn phường/xã</option>
                        {getWardsByCity(storeCity).map((ward) => (
                          <option key={ward.id} value={ward.id}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="business-address-street">
                    <div className="business-input-wrapper">
                      <input 
                        type="text" 
                        placeholder="Nhập số nhà, tên đường" 
                        value={storeStreet}
                        onChange={(e) => setStoreStreet(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Chu kỳ thanh toán <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper select-wrapper">
                    <select
                      value={selectedPaymentCycle}
                      onChange={(e) => setSelectedPaymentCycle(e.target.value)}
                    >
                      <option value="" disabled hidden>Chọn chu kỳ thanh toán</option>
                      {paymentCycles.map((cycle) => (
                        <option key={cycle.id} value={cycle.id}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="karaoke-room-list">
                  {karaokeRoomRows.map((row, index) => (
                    <div className="karaoke-room-row" key={index}>
                      <div className="business-form-field karaoke-room-field">
                        <label className="business-form-label">
                          Diện tích (m2) <span className="required-star">*</span>
                        </label>
                        <div className="business-input-wrapper">
                          <input
                            type="text"
                            placeholder="Nhập diện tích phòng"
                            value={row.area}
                            onChange={(e) => handleRoomRowChange(index, 'area', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="business-form-field karaoke-room-field">
                        <label className="business-form-label">
                          Số phòng
                        </label>
                        <div className="business-input-wrapper">
                          <input
                            type="text"
                            placeholder="Nhập số phòng"
                            value={row.count}
                            onChange={(e) => handleRoomRowChange(index, 'count', e.target.value)}
                          />
                        </div>
                      </div>

                      {index === karaokeRoomRows.length - 1 ? (
                        <button type="button" className="karaoke-room-add-button" onClick={handleAddKaraokeRoomRow}>
                          <span>+ thêm</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="karaoke-room-delete-button"
                          onClick={() => handleRemoveKaraokeRoomRow(index)}
                          aria-label="Xoá dòng"
                          title="Xoá dòng"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                            <path d="M4 7h16M9 7V4.5A1.5 1.5 0 0 1 10.5 3h3A1.5 1.5 0 0 1 15 4.5V7m-9 0 1.1 12.2A2 2 0 0 0 9.1 21h5.8a2 2 0 0 0 2-1.8L18 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 11v6M14 11v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : selectedType === 'karaoke' && karaokeSubType === 'box' ? (
              <div className="karaoke-box-form-wrapper">
                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Tên cơ sở kinh doanh <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập tên cơ sở kinh doanh" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Địa chỉ cơ sở kinh doanh <span className="required-star">*</span>
                  </label>

                  <div className="business-address-row">
                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeCity}
                        onChange={(e) => {
                          const cityId = e.target.value
                          setStoreCity(cityId)
                          setStoreWard(getWardsByCity(cityId)[0]?.id ?? '')
                        }}
                      >
                        <option value="" disabled hidden>Chọn tỉnh/thành phố</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeWard}
                        onChange={(e) => setStoreWard(e.target.value)}
                      >
                        <option value="" disabled hidden>Chọn phường/xã</option>
                        {getWardsByCity(storeCity).map((ward) => (
                          <option key={ward.id} value={ward.id}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="business-address-street">
                    <div className="business-input-wrapper">
                      <input 
                        type="text" 
                        placeholder="Nhập số nhà, tên đường" 
                        value={storeStreet}
                        onChange={(e) => setStoreStreet(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Chu kỳ thanh toán <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper select-wrapper">
                    <select
                      value={selectedPaymentCycle}
                      onChange={(e) => setSelectedPaymentCycle(e.target.value)}
                    >
                      <option value="" disabled hidden>Chọn chu kỳ thanh toán</option>
                      {paymentCycles.map((cycle) => (
                        <option key={cycle.id} value={cycle.id}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Số karaoke box <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập số karaoke box" 
                      value={karaokeBoxCount}
                      onChange={(e) => setKaraokeBoxCount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : selectedType === 'hotel' ? (
              <div className="hotel-form-wrapper">
                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Tên cơ sở kinh doanh <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập tên cơ sở kinh doanh" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Địa chỉ cơ sở kinh doanh <span className="required-star">*</span>
                  </label>

                  <div className="business-address-row">
                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeCity}
                        onChange={(e) => {
                          const cityId = e.target.value
                          setStoreCity(cityId)
                          setStoreWard(getWardsByCity(cityId)[0]?.id ?? '')
                        }}
                      >
                        <option value="" disabled hidden>Chọn tỉnh/thành phố</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeWard}
                        onChange={(e) => setStoreWard(e.target.value)}
                      >
                        <option value="" disabled hidden>Chọn phường/xã</option>
                        {getWardsByCity(storeCity).map((ward) => (
                          <option key={ward.id} value={ward.id}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="business-address-street">
                    <div className="business-input-wrapper">
                      <input 
                        type="text" 
                        placeholder="Nhập số nhà, tên đường" 
                        value={storeStreet}
                        onChange={(e) => setStoreStreet(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Chu kỳ thanh toán <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper select-wrapper">
                    <select
                      value={selectedPaymentCycle}
                      onChange={(e) => setSelectedPaymentCycle(e.target.value)}
                    >
                      <option value="" disabled hidden>Chọn chu kỳ thanh toán</option>
                      {paymentCycles.map((cycle) => (
                        <option key={cycle.id} value={cycle.id}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="hotel-room-grid">
                  <div className="business-form-field">
                    <label className="business-form-label">
                      Hạng <span className="required-star">*</span>
                    </label>
                    <div className="business-input-wrapper select-wrapper">
                      <select 
                        value={hotelStar}
                        onChange={(e) => setHotelStar(e.target.value)}
                      >
                        <option value="" disabled hidden> Hạng sao</option>
                        <option value="1 sao">1 sao</option>
                        <option value="2 sao">2 sao</option>
                        <option value="3 sao">3 sao</option>
                        <option value="4 sao">4 sao</option>
                        <option value="5 sao">5 sao</option>
                      </select>
                    </div>
                  </div>

                  <div className="business-form-field">
                    <label className="business-form-label">
                      Số phòng
                    </label>
                    <div className="business-input-wrapper">
                      <input 
                        type="text" 
                        placeholder="Nhập số phòng" 
                        value={hotelRooms}
                        onChange={(e) => setHotelRooms(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="business-form-grid">
                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Tên cơ sở kinh doanh <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập tên cơ sở kinh doanh" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Địa chỉ cơ sở kinh doanh <span className="required-star">*</span>
                  </label>

                  <div className="business-address-row">
                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeCity}
                        onChange={(e) => {
                          const cityId = e.target.value
                          setStoreCity(cityId)
                          setStoreWard(getWardsByCity(cityId)[0]?.id ?? '')
                        }}
                      >
                        <option value="" disabled hidden>Chọn tỉnh/thành phố</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.id}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="business-input-wrapper select-wrapper">
                      <select
                        value={storeWard}
                        onChange={(e) => setStoreWard(e.target.value)}
                      >
                        <option value="" disabled hidden>Chọn phường/xã</option>
                        {getWardsByCity(storeCity).map((ward) => (
                          <option key={ward.id} value={ward.id}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="business-address-street">
                    <div className="business-input-wrapper">
                      <input 
                        type="text" 
                        placeholder="Nhập số nhà, tên đường" 
                        value={storeStreet}
                        onChange={(e) => setStoreStreet(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="business-form-field">
                  <label className="business-form-label">
                    Diện tích (m2) <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Nhập diện tích (m2)" 
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                </div>

                <div className="business-form-field">
                  <label className="business-form-label">
                    Chu kỳ thanh toán <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper select-wrapper">
                    <select
                      value={selectedPaymentCycle}
                      onChange={(e) => setSelectedPaymentCycle(e.target.value)}
                    >
                      <option value="" disabled hidden>Chọn chu kỳ thanh toán</option>
                      {paymentCycles.map((cycle) => (
                        <option key={cycle.id} value={cycle.id}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="business-commitment-container">
            <label className="business-checkbox-label" onClick={(e) => {
              if (!isAgreed) {
                e.preventDefault()
                handleOpenConsentModal()
              }
            }}>
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={() => {}}
              />
              <span className="checkmark-box"></span>
              <span>Tôi cam kết các thông tin đăng ký là đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật.</span>
            </label>

            <div className="business-submit-wrapper">
              <button
                type="button"
                className="btn-register-submit"
                disabled={!isAgreed || isSubmitting}
                onClick={handleSubmitRegister}
              >
                {isSubmitting ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ SỬ DỤNG'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {isSuccessModalOpen && (
        <div className="register-success-modal" onClick={() => setIsSuccessModalOpen(false)}>
          <div className="register-success-panel" onClick={(e) => e.stopPropagation()}>
            <h3 className="register-success-title">Quý doanh nghiệp đã đăng ký thành công.</h3>

            <div className="register-success-check-wrap">
              <img src={checkCircle} alt="Đăng ký thành công" className="register-success-check" />
            </div>

            <div className="register-success-card">
              <div className="register-success-row">
                <span className="register-success-label">Mã đăng ký</span>
                <span className="register-success-value">{registrationInfo?.code}</span>
              </div>

              <div className="register-success-row">
                <span className="register-success-label">Người đăng ký</span>
                <span className="register-success-value">{registrationInfo?.registrantName}</span>
              </div>

              <div className="register-success-row">
                <span className="register-success-label">Thời gian đăng ký</span>
                <span className="register-success-value">{registrationInfo?.time}</span>
              </div>
            </div>

            <div className="register-success-actions">
              <button type="button" className="register-success-primary" onClick={() => setIsSuccessModalOpen(false)}>
                Về trang chủ
              </button>
              <button type="button" className="register-success-secondary" onClick={() => setIsSuccessModalOpen(false)}>
                Tải biên nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {isConsentModalOpen && (
        <div className="register-terms-modal consent-modal-overlay" onClick={() => setIsConsentModalOpen(false)}>
          <div className="consent-modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="consent-modal-header-badge">
              ĐIỀU KHOẢN DỊCH VỤ VÀ CAM KẾT SỬ DỤNG
            </div>

            <div className="consent-modal-card">
              <div
                ref={consentTermsRef}
                className="consent-modal-scrollable"
                onScroll={handleScrollConsent}
              >
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
                  1.1. <strong>"Trung tâm" / "APPA-CMC":</strong> Trung tâm Khai thác Quyền biểu diễn âm nhạc Việt
                  Nam, tổ chức đại diện tập thể quyền liên quan trực thuộc Hiệp hội Công nghiệp Ghi âm
                  Việt Nam (RIAV), hoạt động theo Công văn số 11509/BNV-TCPCP ngày 02/10/2025 của Bộ Nội vụ.
                </p>
                <p className="terms-paragraph">
                  1.2. <strong>"Đơn vị sử dụng" / "Người đăng ký" / "Khách hàng":</strong> Tổ chức, cá nhân, hộ kinh
                  doanh thực hiện đăng ký, kê khai thông tin và sử dụng dịch vụ cấp phép quyền liên quan
                  qua hệ thống của Trung tâm.
                </p>
                <p className="terms-paragraph">
                  1.3. <strong>"Quyền liên quan":</strong> Quyền của nhà sản xuất bản ghi âm, ghi hình và quyền của người
                  biểu diễn đối với bản ghi đã công bố, theo quy định của Luật Sở hữu trí tuệ và Nghị định
                  17/2023/NĐ-CP.
                </p>
                <p className="terms-paragraph">
                  1.4. <strong>"Giấy chứng nhận cấp phép":</strong> Văn bản (kèm mã QR xác minh) do Trung tâm phát hành,
                  xác nhận Bên sử dụng đã được cấp phép sử dụng Quyền liên quan đối với bản ghi trong phạm vi và thời
                  hạn ghi trên giấy.
                </p>
                <p className="terms-paragraph">
                  1.5. <strong>Phạm vi áp dụng:</strong> Điều khoản này áp dụng cho toàn bộ các loại hình cấp phép do Trung tâm
                  cung cấp, bao gồm nhưng không giới hạn:
                </p>
                <ul className="terms-list">
                  <li>Cơ sở có nhạc nền (cà phê, nhà hàng, khách sạn, cửa hàng, spa,...);</li>
                  <li>Cơ sở giải trí (karaoke, bar, vũ trường,...);</li>
                  <li>Phát sóng (phát thanh, truyền hình), quảng cáo, sự kiện biểu diễn, phim ảnh, vận tải hành khách và các loại hình kinh doanh/khai thác khác.</li>
                </ul>

                <h4 className="terms-section-title">ĐIỀU 2: PHẠM VI CẤP PHÉP VÀ LƯU Ý QUAN TRỌNG VỀ QUYỀN TÁC GIẢ</h4>
                <p className="terms-paragraph">
                  2.1. <strong>Phạm vi cấp phép:</strong> Giấy chứng nhận do Trung tâm cấp chỉ bao gồm Quyền liên quan (quyền
                  của người biểu diễn và nhà sản xuất bản ghi) đối với các bản ghi thuộc danh mục Trung tâm được ủy quyền quản lý.
                </p>
                <p className="terms-paragraph">
                  2.2. <strong>Không bao gồm Quyền tác giả:</strong> Giấy chứng nhận này KHÔNG BAO GỒM QUYỀN TÁC GIẢ (quyền đối với tác phẩm âm nhạc — giai điệu, lời). Quyền tác giả do Trung tâm Bảo vệ Quyền tác giả Âm nhạc Việt Nam (VCPMC) đại diện thu riêng.
                </p>

                <h4 className="terms-section-title">ĐIỀU 3: CƠ CHẾ TỰ KÊ KHAI VÀ TRÁCH NHIỆM CỦA ĐƠN VỊ SỬ DỤNG / NGƯỜI ĐĂNG KÝ</h4>
                <p className="terms-paragraph">
                  3.1. <strong>Cơ chế tự kê khai:</strong> Hệ thống cấp phép của Trung tâm hoạt động hoàn toàn theo cơ chế tự kê khai, tự chịu trách nhiệm. Trung tâm không thực hiện thẩm định thực địa tại thời điểm cấp phép.
                </p>

                <h4 className="terms-section-title">ĐIỀU 4: QUY TRÌNH ĐĂNG KÝ, THANH TOÁN VÀ CẤP PHÉP</h4>
                <p className="terms-paragraph">
                  4.1. <strong>Quy trình 07 bước:</strong> (i) Chọn loại hình cấp phép → (ii) Chấp thuận Điều khoản này → (iii) Kê khai thông tin pháp lý, địa điểm, liên hệ → (iv) Hệ thống tự định giá → (v) Tạo đơn và nhận liên kết thanh toán → (vi) Thanh toán và tải lên chứng từ → (vii) Trung tâm xác nhận và phát hành Giấy chứng nhận.
                </p>

                <h4 className="terms-section-title">ĐIỀU 5: THỜI HẠN, GIA HẠN VÀ THAY ĐỔI NGUỒN CẤP PHÉP</h4>
                <p className="terms-paragraph">
                  5.1. <strong>Thời hạn Giấy chứng nhận:</strong> Giấy chứng nhận có giá trị trong thời hạn ghi rõ trên văn bản. Hệ thống sẽ tự động gửi email nhắc gia hạn trước khi hết hạn.
                </p>

                <h4 className="terms-section-title">ĐIỀU 6: QUYỀN CUNG CẤP VÀ PHÂN CHIA TIỀN BẢN QUYỀN</h4>
                <p className="terms-paragraph">
                  6.1. <strong>Quyền sử dụng thông tin:</strong> Đơn vị sử dụng đồng ý cho Trung tâm sử dụng các thông tin đã cung cấp để xử lý hồ sơ, cấp phép và thực hiện nghĩa vụ pháp lý liên quan.
                </p>

                <h4 className="terms-section-title">ĐIỀU 7: BẢO MẬT VÀ GIẢI QUYẾT TRANH CHẤP</h4>
                <p className="terms-paragraph">
                  7.1. <strong>Bảo mật dữ liệu:</strong> Trung tâm cam kết bảo mật thông tin do Đơn vị sử dụng cung cấp theo quy định của pháp luật.
                </p>

                <h4 className="terms-section-title">ĐIỀU 8: ĐIỀU KHOẢN CHUNG</h4>
                <p className="terms-paragraph">
                  8.1. Việc Đơn vị sử dụng đánh dấu chấp thuận và tiếp tục quy trình kê khai/đăng ký được xác nhận là đã giao kết và đồng ý với toàn bộ Điều khoản này.
                </p>
              </div>
            </div>

            <div className="consent-modal-footer">
              <label className="consent-modal-checkbox-label">
                <input
                  type="checkbox"
                  checked={modalConsentChecked}
                  disabled={!hasReadConsent}
                  onChange={handleModalConsentChange}
                />
                <span className="consent-custom-checkbox">
                  {modalConsentChecked && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span>Tôi đã đọc và đồng ý với nội dung điều khoản dịch vụ & cam kết sử dụng</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegisterPage;