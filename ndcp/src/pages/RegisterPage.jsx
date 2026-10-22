import { useRef, useState } from 'react'
import checkCircle from '../assets/Check-circle.png'
import FeeResultCard from '../components/FeeResultCard'

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzD7AVwQoWvYkUyzHGVM9XFqvwAm8cX5C_kkn_MExe7u_S0EE-H7xsYJvw6JLrBB5ks/exec";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

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
  } catch { }

  return String(nextCount).padStart(3, '0')
}

function RegisterPage({
  selectedType,
  currentBusinessType,
  selectedCity,
  selectedWard,
  setSelectedCity,
  setSelectedWard,
  storeCity,
  storeWard,
  setStoreCity,
  setStoreWard,
  area,
  setArea,
  selectedPaymentCycle,
  setSelectedPaymentCycle,
  isAgreed,
  setIsAgreed,
  cities,
  getWardsByCity,
  paymentCycles,
  karaokeRoomRules,
  karaokeBoxRule,
  karaokeCounts,
  setKaraokeCounts,
  karaokeSubType,
  setKaraokeSubType,
  karaokeBoxCount,
  setKaraokeBoxCount,
  hotelStar,
  setHotelStar,
  hotelRooms,
  setHotelRooms,
  feeResult,
}) {
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [hasReadConsent, setHasReadConsent] = useState(false)
  const [modalConsentChecked, setModalConsentChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationError, setRegistrationError] = useState('')

  // State các trường thông tin Form
  const [companyName, setCompanyName] = useState('')
  const [taxCode, setTaxCode] = useState('')
  const [companyStreet, setCompanyStreet] = useState('')
  const [legalRepresentative, setLegalRepresentative] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  // State lưu file giấy phép kinh doanh đính kèm
  const [licenseFile, setLicenseFile] = useState(null)

  const [storeName, setStoreName] = useState('')
  const [storeStreet, setStoreStreet] = useState('')

  const [registrationInfo, setRegistrationInfo] = useState(null)
  const consentTermsRef = useRef(null)

  // Hàm chuyển đổi file sang Base64 để gửi qua Google Apps Script
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const encoded = reader.result.toString().replace(/^data:(.*,)?/, '');
        resolve({
          base64: encoded,
          mimeType: file.type,
          name: file.name
        });
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmitRegister = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setRegistrationError('')

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
      scaleDetails = [...karaokeRoomRules, karaokeBoxRule]
        .filter((rule) => Number(karaokeCounts[rule.key]) > 0)
        .map((rule) => `${rule.label}: ${karaokeCounts[rule.key]}`)
        .join(' | ')
    } else if (selectedType === 'karaoke' && karaokeSubType === 'box') {
      scaleDetails = `Số Karaoke Box: ${karaokeBoxCount}`
    } else if (selectedType === 'hotel') {
      scaleDetails = `Hạng sao: ${hotelStar}, Số phòng: ${hotelRooms}`
    } else {
      scaleDetails = `Diện tích: ${area} m2`
    }

    let fileDataObj = { fileData: '', fileName: '', fileMimeType: '' };
    if (licenseFile) {
      try {
        const converted = await convertFileToBase64(licenseFile);
        fileDataObj = {
          fileData: converted.base64,
          fileName: converted.name,
          fileMimeType: converted.mimeType
        };
      } catch (err) {
        setRegistrationError(`Không thể đọc tệp đính kèm: ${err.message}`)
        setIsSubmitting(false)
        return
      }
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
      scaleDetails,
      feeAmount: typeof feeResult?.totalWithVat === 'number' ? feeResult.totalWithVat : null,
      ...fileDataObj
    }

    try {
      const { fileData: _fileData, ...cmsPayload } = payload
      const response = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsPayload),
      })
      const responseData = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(responseData.message || 'Không thể gửi hồ sơ đến APPA CMS')
      }

      if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL") {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
        } catch (err) {
          console.error('Đã lưu hồ sơ vào APPA CMS nhưng không gửi được sang Apps Script:', err)
        }
      }
      setRegistrationInfo({
        code: responseData.registration?.id || registrationCode,
        registrantName: legalRepresentative.trim(),
        time: formatRegistrationTime(now),
      })
      setIsSuccessModalOpen(true)
    } catch (err) {
      setRegistrationError(err.message || 'Không thể gửi hồ sơ đến APPA CMS')
    } finally {
      setIsSubmitting(false)
    }
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

  return (
    <div className="register-page-shell">
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
                  Email liên hệ (hóa đơn điện tử xin vui lòng gửi qua email công ty) <span className="required-star">*</span>
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

              <div className="business-form-field full-width" style={{ marginTop: '8px' }}>
                <label className="business-form-label">
                  Giấy phép kinh doanh (Đính kèm file ảnh hoặc PDF) <span className="required-star">*</span>
                </label>
                <div className="business-input-wrapper" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '12px', padding: '6px 16px' }}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setLicenseFile(e.target.files[0])}
                    style={{ border: 'none', background: 'transparent', padding: '8px 0', color: '#ffffff', width: '100%' }}
                  />
                </div>
                {licenseFile && (
                  <span style={{ fontSize: '0.85rem', color: '#8fe08c', marginTop: '4px' }}>
                    Đã chọn: {licenseFile.name}
                  </span>
                )}
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

          {selectedType === 'karaoke' && (
            <div className="register-input-wrap">
              <span className="register-field-label">Loại hình kinh doanh đã chọn</span>
              <div className="register-karaoke-select-box">
                <select
                  value={karaokeSubType}
                  onChange={(event) => setKaraokeSubType(event.target.value)}
                >
                  <option value="room">Cơ sở kinh doanh dv karaoke phòng</option>
                  <option value="box">Cơ sở kinh doanh dv karaoke box</option>
                </select>
              </div>
            </div>
          )}

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

                <div className="business-form-grid">
                  {karaokeRoomRules.map((rule) => (
                    <div className="business-form-field" key={rule.key}>
                      <label className="business-form-label">
                        {rule.label} <em className="karaoke-hint">{rule.hint}</em>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="Nhập số phòng"
                          value={karaokeCounts[rule.key]}
                          onChange={(e) =>
                            setKaraokeCounts((prev) => ({
                              ...prev,
                              [rule.key]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  ))}

                  <div className="business-form-field">
                    <label className="business-form-label">
                      {karaokeBoxRule.label} <em className="karaoke-hint">{karaokeBoxRule.hint}</em>
                    </label>
                    <div className="business-input-wrapper">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Nhập số box"
                        value={karaokeCounts[karaokeBoxRule.key]}
                        onChange={(e) =>
                          setKaraokeCounts((prev) => ({
                            ...prev,
                            [karaokeBoxRule.key]: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
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

          {feeResult ? <FeeResultCard feeResult={feeResult} /> : null}

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
                onChange={() => { }}
              />
              <span className="checkmark-box"></span>
              <span>Tôi cam kết các thông tin đăng ký là đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật.</span>
            </label>

            <div className="business-submit-wrapper">
              {registrationError && (
                <p role="alert" style={{ color: '#d93838', fontSize: '13px', marginBottom: '12px' }}>
                  {registrationError}
                </p>
              )}
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
                  <br />a) Nộp bổ sung đầy đủ phần phí chênh lệch;
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
                  8.1. <strong>Sửa đổi, bổ sung:</strong> Trung tâm có quyền cập nhật, sửa đổi Điều khoản này khi cần thiết. Phiên bản áp dụng đối với Đơn vị sử dụng / Người đăng ký là phiên bản được hiển thị trên hệ thống tại thời điểm Đơn vị sử dụng / Người đăng ký nhấn chấp thuận và tạo đơn thành công.
                </p>
                <p className="terms-paragraph">
                  8.2. <strong>Giá trị giao kết:</strong> Việc Đơn vị sử dụng / Người đăng ký đánh dấu (check) vào ô chấp thuận và tiếp tục quy trình kê khai/đăng ký được xác nhận là đã hiểu rõ và hoàn toàn đồng ý với toàn bộ nội dung của Điều khoản sử dụng và cam kết thực hiện các nghĩa vụ quy định tại Điều khoản này. Việc đồng ý này bao gồm cung cấp các thông tin về kỹ thuật cần thiết để làm bằng chứng chấp thuận Điều khoản, bao gồm nhưng không giới hạn ở địa chỉ IP, User-Agent, thời gian chính xác, vị trí, tọa độ, thiết bị.
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