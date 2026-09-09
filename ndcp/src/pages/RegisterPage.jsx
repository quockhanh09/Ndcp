import { useRef, useState } from 'react'
import checkCircle from '../assets/Check-circle.png'

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7 2.75h6.9L18.75 7.6V21.25H7A2.25 2.25 0 0 1 4.75 19V5A2.25 2.25 0 0 1 7 2.75Z" fill="currentColor" opacity="0.18" />
      <path d="M13.9 2.75V7.5h4.85" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.8 10.2h8.4M7.8 13.2h8.4M7.8 16.2h5.7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

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

// Tracks how many registrations have been created for the current day using localStorage.
function getNextDailyOrderNumber(date) {
  const dateKey = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
  const storageKey = `ndcp_daily_order_${dateKey}`

  let nextCount = 1
  try {
    nextCount = Number(window.localStorage.getItem(storageKey) || '0') + 1
    window.localStorage.setItem(storageKey, String(nextCount))
  } catch {
    // localStorage unavailable (e.g. private mode); fall back to order 1.
  }

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
  karaokeRoomRules,
  karaokeBoxRule,
  karaokeCounts,
  setKaraokeCounts,
  karaokeSubType,
  setKaraokeSubType,
}) {
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [hasReadConsent, setHasReadConsent] = useState(false)
  const [modalConsentChecked, setModalConsentChecked] = useState(false)
  const [karaokeRoomRows, setKaraokeRoomRows] = useState([
    { area: '', count: '' },
  ])
  const [legalRepresentative, setLegalRepresentative] = useState('')
  const [registrationInfo, setRegistrationInfo] = useState(null)
  const consentTermsRef = useRef(null)

  const handleSubmitRegister = () => {
    const abbreviation =
      selectedType === 'karaoke'
        ? karaokeSubTypeAbbreviations[karaokeSubType] ?? 'KR'
        : businessTypeAbbreviations[selectedType] ?? 'KH'
    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    const now = new Date()
    const orderNumber = getNextDailyOrderNumber(now)

    setRegistrationInfo({
      code: `APPA-CMC-${abbreviation}-${randomNumber}-${orderNumber}`,
      registrantName: legalRepresentative.trim(),
      time: formatRegistrationTime(now),
    })
    setIsSuccessModalOpen(true)
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
      if (prev.length === 1) {
        return [{ area: '', count: '' }]
      }

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
    if (isAtBottom) {
      setHasReadConsent(true)
    }
  }

  const handleToggleConsent = () => {
    if (!isAgreed) {
      handleOpenConsentModal()
      return
    }

    setIsAgreed(false)
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
      <section className="hero-card">
        <div className="hero-icon" aria-hidden="true">
          <DocumentIcon />
        </div>
        <div className="hero-copy">
          <h1>Biểu phí theo Nghị định 17/2023/NĐ-CP</h1>
          <p>Mức lương cơ sở: 2.530.000 ₫</p>
          <div className="hero-math">
            <span>Số tiền bản quyền chi trả (tính theo năm) = Mức lương cơ sở × Hệ số điều chỉnh</span>
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
                  <input type="text" placeholder="Nhập tên doanh nghiệp/Hộ kinh doanh" />
                </div>
              </div>

              <div className="business-form-field">
                <label className="business-form-label">
                  MST <span className="required-star">*</span>
                </label>
                <div className="business-input-wrapper">
                  <input type="text" placeholder="Nhập MST" />
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
                    <input type="text" placeholder="Nhập số nhà, tên đường" />
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
                    <input type="text" placeholder="Nhập số điện thoại" />
                  </div>
                </div>
              </div>

              <div className="business-form-field">
                <label className="business-form-label">
                  Email liên hệ <span className="required-star">*</span>
                </label>
                <div className="business-input-wrapper">
                  <input type="email" placeholder="Nhập email" />
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
                    <input type="text" placeholder="Nhập tên cơ sở kinh doanh" />
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
                      <input type="text" placeholder="Nhập số nhà, tên đường" />
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
                    <input type="text" placeholder="text input" />
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
                        <option value="" disabled hidden>text input</option>
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
                        <option value="" disabled hidden>text input</option>
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
                      <input type="text" placeholder="text input" />
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
                    <input type="text" placeholder="text input" />
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
                    <input type="text" placeholder="text input" />
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
                        <option value="" disabled hidden>text input</option>
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
                        <option value="" disabled hidden>text input</option>
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
                      <input type="text" placeholder="text input" />
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
                      <select defaultValue="">
                        <option value="" disabled hidden> Hạng sao</option>
                        <option value="1">1 sao</option>
                        <option value="2">2 sao</option>
                        <option value="3">3 sao</option>
                        <option value="4">4 sao</option>
                        <option value="5">5 sao</option>
                      </select>
                    </div>
                  </div>

                  <div className="business-form-field">
                    <label className="business-form-label">
                      Số phòng
                    </label>
                    <div className="business-input-wrapper">
                      <input type="text" placeholder="text input" />
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
                    <input type="text" placeholder="text input" />
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
                        <option value="" disabled hidden>text input</option>
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
                        <option value="" disabled hidden>text input</option>
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
                      <input type="text" placeholder="text input" />
                    </div>
                  </div>
                </div>

                <div className="business-form-field">
                  <label className="business-form-label">
                    Diện tích (m2) <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper">
                    <input type="text" placeholder="text input" />
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
                disabled={!isAgreed}
                onClick={handleSubmitRegister}
              >
                ĐĂNG KÝ SỬ DỤNG
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

                <p className="terms-paragraph">
                  2.3. <strong>Nghĩa vụ độc lập của Đơn vị sử dụng / Người đăng ký:</strong>
                </p>

                <ul className="terms-list">
                  <li>Đơn vị sử dụng / Người đăng ký có nghĩa vụ tự liên hệ với VCPMC hoặc chủ sở hữu tác phẩm để được cấp phép quyền tác giả trước khi sử dụng.</li>
                  <li>Việc sử dụng bản ghi âm/ghi hình mà không có đủ cả hai giấy phép (Quyền tác giả + Quyền liên quan) có thể bị xử lý vi phạm theo quy định của pháp luật về sở hữu trí tuệ.</li>
                </ul>

                <p className="terms-paragraph">
                  2.4. <strong>Tính độc lập của khoản phí:</strong> Theo Phụ lục II Nghị định 17/2023/NĐ-CP, biểu giá tiền bản quyền áp dụng tương tự cho chủ sở hữu quyền tác giả và chủ sở hữu quyền liên quan. Hai khoản thu này là độc lập và song song; khoản phí trả cho Trung tâm không thay thế và không bao gồm khoản phí phải trả cho VCPMC.
                </p>

                <p className="terms-paragraph">
                  2.5. <strong>Miễn trừ trách nhiệm:</strong> Trung tâm không chịu trách nhiệm đối với bất kỳ khiếu nại, tranh chấp hay chế tài pháp lý nào phát sinh từ việc Đơn vị sử dụng / Người đăng ký không thực hiện nghĩa vụ thanh toán quyền tác giả cho VCPMC.
                </p>

                <h4 className="terms-section-title">ĐIỀU 3: CƠ CHẾ TỰ KÊ KHAI VÀ TRÁCH NHIỆM CỦA ĐƠN VỊ SỬ DỤNG / NGƯỜI ĐĂNG KÝ</h4>

                <p className="terms-paragraph">
                  3.1. <strong>Cơ chế tự kê khai:</strong> Hệ thống cấp phép của Trung tâm hoạt động hoàn toàn theo cơ chế tự kê khai, tự chịu trách nhiệm. Trung tâm không thực hiện thẩm định thực địa tại thời điểm cấp phép.
                </p>

                <p className="terms-paragraph">
                  3.2. <strong>Cam kết tính chính xác và hợp pháp:</strong>
                </p>

                <ul className="terms-list">
                  <li>Đơn vị sử dụng / Người đăng ký cam kết toàn bộ thông tin, tài liệu và nội dung kê khai trong hồ sơ đăng ký là đầy đủ, chính xác, trung thực và hợp pháp.</li>
                  <li>Thông tin kê khai bao gồm nhưng không giới hạn: loại hình kinh doanh, diện tích, số phòng, số ghế, số kênh, số lượt hành khách, quy mô sự kiện và các thông số dùng để định giá.</li>
                  <li>Mức phí cấp phép được hệ thống tính tự động theo công thức quy định tại Nghị định 17/2023/NĐ-CP và biểu giá của Trung tâm dựa trên thông tin Đơn vị sử dụng / Người đăng ký đã tự cung cấp.</li>
                </ul>

                <p className="terms-paragraph">
                  3.3. <strong>Tuân thủ quyền sở hữu trí tuệ:</strong> Đơn vị sử dụng / Người đăng ký cam kết các nội dung cung cấp, đăng ký không xâm phạm quyền tác giả, quyền liên quan, quyền của người biểu diễn, quyền của nhà sản xuất bản ghi và các quyền, lợi ích hợp pháp khác của bất kỳ tổ chức, cá nhân nào.
                </p>

                <p className="terms-paragraph">
                  3.4. <strong>Trách nhiệm và Chế tài khi kê khai sai:</strong> Trường hợp kê khai sai, thiếu, giả mạo hoặc gian lận dẫn đến mức phí cấp phép thấp hơn mức thực tế phải nộp, Đơn vị sử dụng / Người đăng ký phải tự chịu trách nhiệm trước pháp luật và có nghĩa vụ:
                </p>

                <ul className="terms-list">
                  <li>a) Nộp bổ sung đầy đủ phần phí chênh lệch;</li>
                  <li>b) Nộp tiền lãi chậm nộp tính trên phần chênh lệch theo ngày, áp dụng mức lãi suất chậm nộp theo quy định pháp luật về quản lý thuế;</li>
                  <li>c) Chịu xử phạt vi phạm hành chính từ 10.000.000 VNĐ đến 30.000.000 VNĐ cho mỗi lần vi phạm theo Nghị định 131/2013/NĐ-CP và các văn bản sửa đổi, bổ sung.</li>
                </ul>

                <p className="terms-paragraph">
                  3.5. <strong>Xử lý vi phạm sau cấp phép:</strong> Việc phát hiện kê khai sai có thể diễn ra ở bất kỳ thời điểm nào (kể cả sau khi đã cấp Giấy chứng nhận) thông qua hoạt động kiểm tra của Trung tâm hoặc cơ quan chức năng. Giấy chứng nhận cấp dựa trên thông tin sai lệch có thể bị thu hồi mà không hoàn phí.
                </p>

                <p className="terms-paragraph">
                  3.6. <strong>Trách nhiệm hợp tác:</strong> Đơn vị sử dụng / Người đăng ký có trách nhiệm hợp tác, cung cấp đầy đủ hồ sơ, chứng từ khi Trung tâm hoặc cơ quan nhà nước có thẩm quyền yêu cầu xác minh.
                </p>

                <h4 className="terms-section-title">ĐIỀU 4: QUY TRÌNH ĐĂNG KÝ, THANH TOÁN VÀ CẤP PHÉP</h4>

                <p className="terms-paragraph">
                  4.1. <strong>Quy trình 07 bước:</strong>
                </p>

                <p className="terms-paragraph">(i) Chọn loại hình cấp phép → (ii) Chấp thuận Điều khoản này → (iii) Kê khai thông tin pháp lý, địa điểm, liên hệ → (iv) Hệ thống tự định giá → (v) Tạo đơn và nhận liên kết thanh toán → (vi) Thanh toán và tải lên chứng từ → (vii) Trung tâm xác nhận và phát hành Giấy chứng nhận.</p>

                <p className="terms-paragraph">
                  4.2. <strong>Thời hạn liên kết thanh toán:</strong> Sau khi tạo đơn, Đơn vị sử dụng / Người đăng ký sẽ nhận email kèm liên kết thanh toán có hiệu lực trong 72 giờ. Nếu quá thời hạn trên mà chưa hoàn tất thanh toán, đơn hàng sẽ tự động bị hủy (Đơn vị sử dụng / Người đăng ký có thể tạo đơn mới).
                </p>

                <p className="terms-paragraph">
                  4.3. <strong>Thời gian xử lý cấp phép:</strong> Sau khi Đơn vị sử dụng / Người đăng ký chuyển khoản và tải lên chứng từ thanh toán, Trung tâm sẽ xác minh và phát hành Giấy chứng nhận trong vòng 24 giờ làm việc.
                </p>

                <p className="terms-paragraph">
                  4.4. <strong>Quyền từ chối/hủy đơn của Trung tâm:</strong> Trung tâm có quyền kiểm tra hồ sơ và từ chối tiếp nhận hoặc hủy đơn (có gửi thông báo qua email) trong các trường hợp: không nhận được thanh toán, chứng từ không hợp lệ, thông tin kê khai mâu thuẫn/không đáp ứng điều kiện hoặc có dấu hiệu vi phạm pháp luật.
                </p>

                <p className="terms-paragraph">
                  4.5. <strong>Kiểm soát tính chính xác của phí:</strong> Mức phí sẽ được hệ thống máy chủ tự động tính toán lại ngay trước khi phát hành liên kết thanh toán nhằm bảo đảm tính chính xác và chống can thiệp. Mức phí cuối cùng có giá trị áp dụng là mức phí do máy chủ xác định.
                </p>

                <h4 className="terms-section-title">ĐIỀU 5: THỜI HẠN, GIA HẠN VÀ THAY ĐỔI NGUỒN CẤP PHÉP</h4>

                <p className="terms-paragraph">
                  5.1. <strong>Thời hạn Giấy chứng nhận:</strong> Giấy chứng nhận có giá trị trong thời hạn ghi rõ trên văn bản (theo năm hoặc theo quý tùy loại hình và lựa chọn đăng ký). Hệ thống sẽ tự động gửi email nhắc gia hạn trước khi hết hạn.
                </p>

                <p className="terms-paragraph">
                  5.2. <strong>Cấp phép một lần:</strong> Đối với các loại hình cấp phép sự kiện biểu diễn, sự kiện doanh nghiệp, phim ảnh,... Giấy chứng nhận chỉ có giá trị cho duy nhất 01 lần sử dụng/sự kiện đã kê khai.
                </p>

                <p className="terms-paragraph">
                  5.3. <strong>Thay đổi nguồn cấp phép:</strong> Trường hợp chủ sở hữu quyền (hội viên/nhà sản xuất) thay đổi hoặc rút ủy quyền đối với bản ghi:
                </p>

                <ul className="terms-list">
                  <li>Giấy chứng nhận/Hợp đồng đã cấp trước thời điểm thay đổi vẫn tiếp tục có hiệu lực cho đến hết thời hạn.</li>
                  <li>Thay đổi chỉ bắt đầu áp dụng đối với các bản ghi tương ứng sau 60 ngày kể từ thời điểm thay đổi được ghi nhận.</li>
                </ul>

                <p className="terms-paragraph">
                  5.4. <strong>Quản lý dữ liệu lịch sử:</strong> Dữ liệu lịch sử cấp phép được lưu trữ vĩnh viễn trên hệ thống. Khi một bản ghi không còn trong phạm vi ủy quyền, bản ghi đó sẽ bị ẩn khỏi danh mục cấp phép mới nhưng lịch sử đã cấp phép vẫn được lưu trữ và tra cứu bình thường.
                </p>

                <h4 className="terms-section-title">ĐIỀU 6: QUYỀN CUNG CẤP VÀ PHÂN CHIA TIỀN BẢN QUYỀN</h4>

                <p className="terms-paragraph">
                  6.1. <strong>Quyền sử dụng thông tin của Trung tâm:</strong> Đơn vị sử dụng / Người đăng ký đồng ý cho Trung tâm sử dụng các thông tin, tài liệu đã cung cấp nhằm mục đích tiếp nhận, thẩm định, xử lý hồ sơ, cấp phép, đối soát, phân chia tiền bản quyền và thực hiện các nghĩa vụ pháp lý liên quan.
                </p>

                <p className="terms-paragraph">
                  6.2. <strong>Phân chia tiền bản quyền:</strong> Tiền bản quyền thu được từ Đơn vị sử dụng / Người đăng ký, sau khi trừ chi phí vận hành theo quy chế của Trung tâm, sẽ được phân chia định kỳ (theo quý) cho chủ sở hữu bản ghi và người biểu diễn dựa trên dữ liệu sử dụng thực tế.
                </p>

                <p className="terms-paragraph">
                  6.3. <strong>Trách nhiệm với Người biểu diễn:</strong> Trách nhiệm bảo đảm quyền của người biểu diễn trong các bản ghi do hội viên/nhà sản xuất ủy quyền thuộc về hội viên/nhà sản xuất đó (trừ trường hợp có thỏa thuận khác bằng văn bản).
                </p>

                <h4 className="terms-section-title">ĐIỀU 7: BẢO MẬT VÀ GIẢI QUYẾT TRANH CHẤP</h4>

                <p className="terms-paragraph">
                  7.1. <strong>Bảo mật dữ liệu:</strong> Trung tâm cam kết bảo mật thông tin do Đơn vị sử dụng / Người đăng ký cung cấp theo quy định pháp luật, trừ trường hợp phải cung cấp theo yêu cầu của cơ quan nhà nước có thẩm quyền.
                </p>

                <p className="terms-paragraph">
                  7.2. <strong>Tranh chấp với bên thứ ba:</strong> Trong trường hợp xảy ra tranh chấp giữa Đơn vị sử dụng / Người đăng ký và bên thứ ba liên quan đến quyền sở hữu bản ghi, Trung tâm chỉ có trách nhiệm cung cấp thông tin lịch sử cấp phép và các số liệu liên quan; các bên tranh chấp có trách nhiệm tự giải quyết với nhau.
                </p>

                <p className="terms-paragraph">
                  7.3. <strong>Luật áp dụng và Cơ quan giải quyết:</strong> Điều khoản này được điều chỉnh theo pháp luật Việt Nam. Mọi tranh chấp phát sinh sẽ được giải quyết trước tiên thông qua thương lượng. Trường hợp thương lượng không thành, tranh chấp sẽ được đưa ra giải quyết tại Tòa án có thẩm quyền tại Việt Nam.
                </p>

                <h4 className="terms-section-title">ĐIỀU 8: ĐIỀU KHOẢN CHUNG</h4>

                <p className="terms-paragraph">
                  8.1. <strong>Sửa đổi, bổ sung:</strong> Trung tâm có quyền cập nhật, sửa đổi Điều khoản này khi cần thiết. Phiên bản áp dụng đối với Đơn vị sử dụng / Người đăng ký là phiên bản được hiển thị trên hệ thống tại thời điểm Đơn vị sử dụng / Người đăng ký nhấn chấp thuận và tạo đơn thành công.
                </p>

                <p className="terms-paragraph">
                  8.2. <strong>Giá trị giao kết:</strong> Việc Đơn vị sử dụng / Người đăng ký đánh dấu (check) vào ô chấp thuận và tiếp tục quy trình kê khai/đăng ký được xác nhận là đã giao kết, hiểu rõ và hoàn toàn đồng ý ràng buộc bởi toàn bộ nội dung của Điều khoản và Cam kết này.
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

export default RegisterPage