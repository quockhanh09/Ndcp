import { useState, useRef } from 'react'
import { cities, getWardsByCity } from '../data/vietnamLocations'
import checkCircle from '../assets/Check-circle.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

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

const copyTypes = [
  { id: 'movie', label: 'Phim điện ảnh' },
  { id: 'tvc', label: 'Quảng cáo TVC' },
  { id: 'album', label: 'Album biên tập' },
  { id: 'arcade', label: 'Máy chơi game Arcade' },
  { id: 'mv_audiovisual', label: 'Video ca nhạc và các tác phẩm nghe nhìn' },
]

const usageModels = [
  'Phim thương mại',
  'Phim thương mại chiếu rạp',
  'Khác'
]

const adMediaOptions = [
  'Truyền hình mặt đất',
  'Phát thanh / Radio',
  'Truyền hình cáp',
  'Internet',
  'Rạp chiếu phim',
  'Khác'
]

const purposeOptions = [
  'Thương mại',
  'Phi thương mại',
  'Giảng dạy',
  'Khác'
]

const mvPurposeOptions = [
  'Music Video',
  'Ghi hình concert',
  'Giảng dạy',
  'Phi thương mại',
  'Khác'
]

const arcadePurposeOptions = [
  'Máy chơi game thương mại',
  'Máy chơi game gia đình',
  'Khác'
]

const productionFormatOptions = [
  'DVD',
  'CD',
  'Cassette',
  'Khác'
]

function CopyPage() {
  const [selectedType, setSelectedType] = useState('movie')

  // --- THÔNG TIN ĐƠN VỊ ĐĂNG KÝ (BƯỚC 02) ---
  const [orgNameVN, setOrgNameVN] = useState('')
  const [orgNameEN, setOrgNameEN] = useState('')
  const [mst, setMst] = useState('')
  const [legalRep, setLegalRep] = useState('')
  const [orgCity, setOrgCity] = useState('')
  const [orgWard, setOrgWard] = useState('')
  const [orgStreet, setOrgStreet] = useState('')
  const [inChargePerson, setInChargePerson] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+84')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [invoiceEmail, setInvoiceEmail] = useState('')
  
  const [businessLicenseFile, setBusinessLicenseFile] = useState(null)

  // --- CHI TIẾT NỘI DUNG ĐĂNG KÝ (BƯỚC 03) ---
  // 1. Phim điện ảnh
  const [movieTitle, setMovieTitle] = useState('')
  const [releaseDate, setReleaseDate] = useState('')
  const [selectedUsageModel, setSelectedUsageModel] = useState('Phim thương mại chiếu rạp')
  const [otherUsageModel, setOtherUsageModel] = useState('')

  // 2. Quảng cáo TVC
  const [adTitle, setAdTitle] = useState('')
  const [adTime, setAdTime] = useState('')
  const [selectedAdMedia, setSelectedAdMedia] = useState('Internet')
  const [otherAdMedia, setOtherAdMedia] = useState('')

  // 3. Album biên tập
  const [selectedPurpose, setSelectedPurpose] = useState('Thương mại')
  const [otherPurpose, setOtherPurpose] = useState('')

  // 4. Video ca nhạc và các tác phẩm nghe nhìn
  const [selectedMvPurpose, setSelectedMvPurpose] = useState('Music Video')
  const [otherMvPurpose, setOtherMvPurpose] = useState('')
  const [musicDuration, setMusicDuration] = useState('')
  const [totalDuration, setTotalDuration] = useState('')

  // 5. Máy chơi game Arcade
  const [selectedArcadePurpose, setSelectedArcadePurpose] = useState('Máy chơi game thương mại')
  const [otherArcadePurpose, setOtherArcadePurpose] = useState('')

  // Chung cho Album, MV, Arcade
  const [selectedFormat, setSelectedFormat] = useState('CD')
  const [otherFormat, setOtherFormat] = useState('')
  const [factoryPrice, setFactoryPrice] = useState('')
  const [quantity, setQuantity] = useState('')

  // --- DANH SÁCH CÁC BẢN GHI ĐĂNG KÝ SỬ DỤNG (BƯỚC 04) ---
  const [recordInputMode, setRecordInputMode] = useState('manual')
  
  const [records, setRecords] = useState([
    { id: 1, songTitle: '', albumTitle: '', performer: '', recordLink: '' }
  ])

  const [excelFile, setExcelFile] = useState(null)
  
  // Cam kết & Modal điều khoản
  const [isAgreed, setIsAgreed] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false)

  // Trạng thái gửi đăng ký về APPA CMS
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [registrationInfo, setRegistrationInfo] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const licenseFileInputRef = useRef(null)
  const excelFileInputRef = useRef(null)
  const termsScrollRef = useRef(null)

  const handleAddRecord = () => {
    setRecords([
      ...records,
      { id: Date.now(), songTitle: '', albumTitle: '', performer: '', recordLink: '' }
    ])
  }

  const handleDeleteRecord = (id) => {
    if (records.length === 1) return
    setRecords(records.filter(r => r.id !== id))
  }

  const handleRecordChange = (id, field, value) => {
    setRecords(records.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const handleLicenseUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBusinessLicenseFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        status: 'Hoàn tất'
      })
    }
  }

  const handleExcelUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setExcelFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        status: 'Hoàn tất'
      })
    }
  }

  const resolveOther = (selected, other) => (selected === 'Khác' ? other.trim() : selected)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAgreed || isSubmitting) return
    setIsSubmitting(true)
    setRegistrationError('')

    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    const now = new Date()
    const orderNumber = getNextDailyOrderNumber(now)
    const registrationCode = `APPA-CMC-SC-${randomNumber}-${orderNumber}`

    const cityName = cities.find((c) => c.id === orgCity)?.name || ''
    const orgAddress = `${orgStreet.trim()}${orgStreet.trim() ? ', ' : ''}${orgWard}${orgWard ? ', ' : ''}${cityName}`

    const validRecords = records
      .filter((r) => r.songTitle.trim() && r.albumTitle.trim() && r.performer.trim() && r.recordLink.trim())
      .map((r) => ({
        songTitle: r.songTitle.trim(),
        albumTitle: r.albumTitle.trim(),
        performer: r.performer.trim(),
        recordLink: r.recordLink.trim(),
      }))

    const usageModelByType = {
      movie: resolveOther(selectedUsageModel, otherUsageModel),
      tvc: resolveOther(selectedAdMedia, otherAdMedia),
      album: resolveOther(selectedPurpose, otherPurpose),
      mv_audiovisual: resolveOther(selectedMvPurpose, otherMvPurpose),
      arcade: resolveOther(selectedArcadePurpose, otherArcadePurpose),
    }
    const contentTitleByType = {
      movie: movieTitle.trim(),
      tvc: adTitle.trim(),
    }
    const contentDetailByType = {
      movie: releaseDate ? `Ngày phát hành: ${releaseDate}` : '',
      tvc: adTime ? `Thời lượng quảng cáo: ${adTime}` : '',
      mv_audiovisual: [
        musicDuration ? `Thời lượng âm nhạc: ${musicDuration}` : '',
        totalDuration ? `Tổng thời lượng: ${totalDuration}` : '',
      ].filter(Boolean).join(' | '),
    }
    const usesProductionFormat = ['album', 'mv_audiovisual', 'arcade'].includes(selectedType)

    const payload = {
      registrationCode,
      copyType: selectedType,
      copyTypeLabel: copyTypes.find((t) => t.id === selectedType)?.label || selectedType,
      orgNameVN: orgNameVN.trim(),
      orgNameEN: orgNameEN.trim(),
      taxCode: mst.trim(),
      orgAddress,
      legalRepresentative: legalRep.trim(),
      inChargePerson: inChargePerson.trim(),
      phone: `${phonePrefix} ${phone}`.trim(),
      email: email.trim(),
      invoiceEmail: invoiceEmail.trim(),
      contentTitle: contentTitleByType[selectedType] || '',
      contentDetail: contentDetailByType[selectedType] || '',
      usageModel: usageModelByType[selectedType] || '',
      productionFormat: usesProductionFormat ? resolveOther(selectedFormat, otherFormat) : '',
      factoryPrice: usesProductionFormat ? parseFloat(factoryPrice) || null : null,
      quantity: usesProductionFormat ? parseFloat(quantity) || null : null,
      recordsCount: recordInputMode === 'manual' ? validRecords.length : 0,
      records: recordInputMode === 'manual' ? validRecords : [],
      feeAmount: 0,
      fileName: businessLicenseFile?.name || '',
      fileMimeType: '',
    }

    try {
      const response = await fetch(`${API_BASE_URL}/copy-registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const responseData = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(responseData.message || 'Không thể gửi hồ sơ đến APPA CMS')
      }
      setRegistrationInfo({
        code: responseData.registration?.id || registrationCode,
        registrantName: payload.legalRepresentative || payload.orgNameVN,
        time: formatRegistrationTime(now),
      })
      setIsSuccessModalOpen(true)
    } catch (err) {
      setRegistrationError(err.message || 'Không thể gửi hồ sơ đến APPA CMS')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Xử lý sự kiện cuộn trong khung điều khoản
  const handleScrollTerms = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollHeight - scrollTop <= clientHeight + 20) {
      setHasScrolledToBottom(true)
    }
  }

  return (
    <div className="register-page-shell">
      <form onSubmit={handleSubmit} className="register-page-shell">
        
        {/* PHẦN 01: LOẠI HÌNH KINH DOANH */}
        <section className="register-panel-card performance-panel">
          <div className="register-section">
            <div className="register-section-head">
              <span className="register-step-number">01</span>
              <h3>LOẠI HÌNH KINH DOANH</h3>
            </div>

            <div className="business-form-container performance-form-box">
              <div className="business-form-grid">
                <div className="business-form-field full-width">
                  <label className="business-form-label">
                    Loại hình sao chép <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper select-wrapper performance-select">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="" disabled>
                        Các loại hình sử dụng bản quyền sao chép
                      </option>
                      {copyTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {selectedType !== '' && (
          <>
            {/* PHẦN 02: THÔNG TIN ĐƠN VỊ ĐĂNG KÝ */}
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head">
                  <span className="register-step-number">02</span>
                  <h3>THÔNG TIN ĐƠN VỊ ĐĂNG KÝ</h3>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                </p>

                <div className="business-form-container">
                  <div className="business-form-grid">
                    
                    <div className="business-form-field">
                      <label className="business-form-label">
                        Tên đơn vị đăng ký (VN) <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={orgNameVN}
                          onChange={(e) => setOrgNameVN(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Tên đơn vị đăng ký (EN) <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={orgNameEN}
                          onChange={(e) => setOrgNameEN(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Mã số đăng ký kinh doanh <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={mst}
                          onChange={(e) => setMst(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Người đại diện pháp luật <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={legalRep}
                          onChange={(e) => setLegalRep(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* LIÊN KẾT TỈNH THÀNH PHỐ VÀ PHƯỜNG XÃ */}
                    <div className="business-form-field full-width">
                      <label className="business-form-label">
                        Địa chỉ trụ sở <span className="required-star">*</span>
                      </label>
                      <div className="business-address-row" style={{ marginBottom: '12px' }}>
                        <div className="business-input-wrapper select-wrapper">
                          <select
                            value={orgCity}
                            onChange={(e) => {
                              setOrgCity(e.target.value)
                              setOrgWard('')
                            }}
                            required
                          >
                            <option value="">Chọn tỉnh / thành phố</option>
                            {cities.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="business-input-wrapper select-wrapper">
                          <select
                            value={orgWard}
                            onChange={(e) => setOrgWard(e.target.value)}
                            required
                          >
                            <option value="">Chọn phường / xã</option>
                            {getWardsByCity(orgCity).map((w) => (
                              <option key={w.id} value={w.name}>{w.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="business-input-wrapper business-address-street">
                        <input
                          type="text"
                          placeholder="Nhập số nhà, tên đường"
                          value={orgStreet}
                          onChange={(e) => setOrgStreet(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field full-width">
                      <label className="business-form-label">
                        Người phụ trách <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={inChargePerson}
                          onChange={(e) => setInChargePerson(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Số điện thoại liên hệ <span className="required-star">*</span>
                      </label>
                      <div className="business-phone-group">
                        <div className="business-input-wrapper select-wrapper phone-prefix-wrapper">
                          <select
                            value={phonePrefix}
                            onChange={(e) => setPhonePrefix(e.target.value)}
                          >
                            <option value="+84">+84</option>
                            <option value="+1">+1</option>
                          </select>
                        </div>
                        <div className="business-input-wrapper phone-input-wrapper">
                          <input
                            type="text"
                            placeholder="number input"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
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
                          placeholder="text input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field full-width">
                      <label className="business-form-label">
                        Email xuất hóa đơn điện tử <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="email"
                          placeholder="text input"
                          value={invoiceEmail}
                          onChange={(e) => setInvoiceEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field full-width" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                      <input
                        type="file"
                        ref={licenseFileInputRef}
                        onChange={handleLicenseUpload}
                        accept=".pdf,.doc,.docx,.png,.jpg"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => licenseFileInputRef.current?.click()}
                        style={{
                          background: '#ABC270',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '20px',
                          padding: '10px 28px',
                          fontSize: '0.92rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Tải lên giấy phép kinh doanh
                      </button>
                    </div>

                  </div>
                </div>

                {businessLicenseFile && (
                  <div
                    style={{
                      marginTop: '16px',
                      border: '1px dashed rgba(255, 255, 255, 0.25)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(255, 255, 255, 0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '42px',
                          background: '#ef4444',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ffffff',
                          fontWeight: '800',
                          fontSize: '0.72rem'
                        }}
                      >
                        PDF
                      </div>
                      <div>
                        <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.92rem' }}>
                          {businessLicenseFile.name}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{businessLicenseFile.size}</span>
                          <span>•</span>
                          <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ✓ {businessLicenseFile.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBusinessLicenseFile(null)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', padding: '4px' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* PHẦN 03: CHI TIẾT NỘI DUNG ĐĂNG KÝ */}
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head">
                  <span className="register-step-number">03</span>
                  <h3>CHI TIẾT NỘI DUNG ĐĂNG KÝ</h3>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                </p>

                <div className="business-form-container">
                  <div className="business-form-grid">
                    
                    {/* 1. PHIM ĐIỆN ẢNH */}
                    {selectedType === 'movie' && (
                      <>
                        <div className="business-form-field">
                          <label className="business-form-label">
                            Tên phim <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={movieTitle}
                              onChange={(e) => setMovieTitle(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Ngày phát hành <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={releaseDate}
                              onChange={(e) => setReleaseDate(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Mô hình sử dụng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedUsageModel}
                              onChange={(e) => setSelectedUsageModel(e.target.value)}
                            >
                              {usageModels.map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedUsageModel === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherUsageModel}
                                onChange={(e) => setOtherUsageModel(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* 2. QUẢNG CÁO TVC */}
                    {selectedType === 'tvc' && (
                      <>
                        <div className="business-form-field">
                          <label className="business-form-label">
                            Tiêu đề quảng cáo <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={adTitle}
                              onChange={(e) => setAdTitle(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Thời gian quảng cáo <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="date input"
                              value={adTime}
                              onChange={(e) => setAdTime(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Phương tiện quảng cáo <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedAdMedia}
                              onChange={(e) => setSelectedAdMedia(e.target.value)}
                            >
                              {adMediaOptions.map((media) => (
                                <option key={media} value={media}>{media}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedAdMedia === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherAdMedia}
                                onChange={(e) => setOtherAdMedia(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* 3. ALBUM BIÊN TẬP */}
                    {selectedType === 'album' && (
                      <>
                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Mục đích sử dụng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedPurpose}
                              onChange={(e) => setSelectedPurpose(e.target.value)}
                            >
                              {purposeOptions.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedPurpose === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherPurpose}
                                onChange={(e) => setOtherPurpose(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Hình thức sản xuất <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedFormat}
                              onChange={(e) => setSelectedFormat(e.target.value)}
                            >
                              {productionFormatOptions.map((f) => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedFormat === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherFormat}
                                onChange={(e) => setOtherFormat(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Giá xuất xưởng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={factoryPrice}
                              onChange={(e) => setFactoryPrice(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Số lượng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* 4. VIDEO CA NHẠC VÀ CÁC TÁC PHẨM NGHE NHÌN */}
                    {selectedType === 'mv_audiovisual' && (
                      <>
                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Mục đích sử dụng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedMvPurpose}
                              onChange={(e) => setSelectedMvPurpose(e.target.value)}
                            >
                              {mvPurposeOptions.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedMvPurpose === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherMvPurpose}
                                onChange={(e) => setOtherMvPurpose(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Thời lượng sử dụng âm nhạc <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={musicDuration}
                              onChange={(e) => setMusicDuration(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Tổng thời lượng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={totalDuration}
                              onChange={(e) => setTotalDuration(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Hình thức sản xuất <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedFormat}
                              onChange={(e) => setSelectedFormat(e.target.value)}
                            >
                              {productionFormatOptions.map((f) => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedFormat === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherFormat}
                                onChange={(e) => setOtherFormat(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Giá xuất xưởng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={factoryPrice}
                              onChange={(e) => setFactoryPrice(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Số lượng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {/* 5. MÁY CHƠI GAME ARCADE */}
                    {selectedType === 'arcade' && (
                      <>
                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Mục đích sử dụng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedArcadePurpose}
                              onChange={(e) => setSelectedArcadePurpose(e.target.value)}
                            >
                              {arcadePurposeOptions.map((p) => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedArcadePurpose === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherArcadePurpose}
                                onChange={(e) => setOtherArcadePurpose(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="business-form-field full-width">
                          <label className="business-form-label">
                            Hình thức sản xuất <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={selectedFormat}
                              onChange={(e) => setSelectedFormat(e.target.value)}
                            >
                              {productionFormatOptions.map((f) => (
                                <option key={f} value={f}>{f}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {selectedFormat === 'Khác' && (
                          <div className="business-form-field full-width">
                            <label className="business-form-label">
                              Khác <span className="required-star">*</span>
                            </label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={otherFormat}
                                onChange={(e) => setOtherFormat(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Giá xuất xưởng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={factoryPrice}
                              onChange={(e) => setFactoryPrice(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field">
                          <label className="business-form-label">
                            Số lượng <span className="required-star">*</span>
                          </label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </>
                    )}

                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN 04: DANH SÁCH CÁC BẢN GHI ĐĂNG KÝ SỬ DỤNG */}
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head">
                  <span className="register-step-number">04</span>
                  <h3>DANH SÁCH CÁC BẢN GHI ĐĂNG KÝ SỬ DỤNG</h3>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp danh sách bản ghi sử dụng bằng cách nhập thông tin hoặc tải lên file (định dạng .excel)
                </p>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'center', margin: '12px 0 16px' }}>
                  <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recordInputMode"
                      checked={recordInputMode === 'manual'}
                      onChange={() => setRecordInputMode('manual')}
                      style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                    />
                    <span>Nhập thông tin</span>
                  </label>

                  <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recordInputMode"
                      checked={recordInputMode === 'excel'}
                      onChange={() => setRecordInputMode('excel')}
                      style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                    />
                    <span>Tải lên file (.excel)</span>
                  </label>
                </div>

                {recordInputMode === 'manual' && (
                  <div className="business-form-container">
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                      <button
                        type="button"
                        onClick={handleAddRecord}
                        style={{
                          background: '#ABC270',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 16px',
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        + thêm
                      </button>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      {records.map((rec, index) => (
                        <div
                          key={rec.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto',
                            gap: '12px',
                            alignItems: 'end',
                            paddingBottom: index < records.length - 1 ? '16px' : '0',
                            borderBottom: index < records.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                          }}
                        >
                          <div className="business-form-field">
                            <label className="business-form-label">Tên bài hát <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={rec.songTitle}
                                onChange={(e) => handleRecordChange(rec.id, 'songTitle', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="business-form-field">
                            <label className="business-form-label">Tên album <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={rec.albumTitle}
                                onChange={(e) => handleRecordChange(rec.id, 'albumTitle', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="business-form-field">
                            <label className="business-form-label">Nghệ sĩ thể hiện <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={rec.performer}
                                onChange={(e) => handleRecordChange(rec.id, 'performer', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="business-form-field">
                            <label className="business-form-label">Link bản ghi <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={rec.recordLink}
                                onChange={(e) => handleRecordChange(rec.id, 'recordLink', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
                            <button
                              type="button"
                              className="karaoke-room-delete-button"
                              onClick={() => handleDeleteRecord(rec.id)}
                              disabled={records.length === 1}
                              style={{ opacity: records.length === 1 ? 0.4 : 1 }}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recordInputMode === 'excel' && (
                  <div className="business-form-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', padding: '32px 24px' }}>
                    <input
                      type="file"
                      ref={excelFileInputRef}
                      onChange={handleExcelUpload}
                      accept=".xls,.xlsx"
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => excelFileInputRef.current?.click()}
                      style={{
                        background: '#ABC270',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '20px',
                        padding: '10px 28px',
                        fontSize: '0.92rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      Tải lên file danh sách bản ghi
                    </button>

                    {excelFile && (
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '520px',
                          border: '1px dashed rgba(255, 255, 255, 0.25)',
                          borderRadius: '12px',
                          padding: '16px 20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          background: 'rgba(255, 255, 255, 0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '42px',
                              background: '#16a34a',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: '#ffffff',
                              fontWeight: '800',
                              fontSize: '0.68rem'
                            }}
                          >
                            XLS
                          </div>
                          <div>
                            <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.92rem' }}>
                              {excelFile.name}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{excelFile.size}</span>
                              <span>•</span>
                              <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                ✓ {excelFile.status}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setExcelFile(null)}
                          style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.6)', cursor: 'pointer', padding: '4px' }}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="business-commitment-container" style={{ marginTop: '24px' }}>
                  <label className="business-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isAgreed}
                      onChange={(e) => setIsAgreed(e.target.checked)}
                    />
                 
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          setHasScrolledToBottom(false)
                          setModalCheckboxChecked(isAgreed)
                          setIsTermsModalOpen(true)
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#93c5fd',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          padding: 0,
                          font: 'inherit',
                        }}
                      >
                        Tôi cam kết các thông tin đăng ký là đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật.
                      </button>{' '}

                  </label>

                  {registrationError && (
                    <p className="registration-error" role="alert" style={{ color: '#f87171', marginTop: '12px' }}>
                      {registrationError}
                    </p>
                  )}

                  <div className="business-submit-wrapper" style={{ marginTop: '12px' }}>
                    <button
                      type="submit"
                      className="btn-register-submit"
                      disabled={!isAgreed || isSubmitting}
                    >
                      {isSubmitting ? 'ĐANG GỬI...' : 'ĐĂNG KÝ SỬ DỤNG'}
                    </button>
                  </div>
                </div>

              </div>
            </section>
          </>
        )}

      </form>

      {/* MODAL ĐĂNG KÝ THÀNH CÔNG */}
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

      {/* MODAL ĐIỀU KHOẢN SỬ DỤNG */}
      {isTermsModalOpen && (
        <div className="register-terms-modal consent-modal-overlay" onClick={() => setIsTermsModalOpen(false)}>
          <div className="consent-modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <div className="consent-modal-header-badge">
              ĐIỀU KHOẢN DỊCH VỤ VÀ CAM KẾT SỬ DỤNG
            </div>

            <div className="consent-modal-card">
              <div 
                className="consent-modal-scrollable" 
                ref={termsScrollRef}
                onScroll={handleScrollTerms}
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
                  1.1. <strong>"Trung tâm" / "APPA-CMC":</strong> Trung tâm Khai thác Quyền biểu diễn Âm nhạc Việt Nam, tổ chức đại diện tập thể quyền liên quan trực thuộc Hội Bảo vệ quyền của nghệ sĩ biểu diễn âm nhạc Việt Nam.
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
                  2.1. <strong>Phạm vi cấp phép:</strong> Giấy chứng nhận do Trung tâm cấp chỉ bao gồm Quyền liên quan của người biểu diễn âm nhạc đối với các bản ghi được công bố và đã được ủy quyền cho Trung tâm.
                </p>
                <p className="terms-paragraph">
                  2.2. <strong>Không bao gồm Quyền tác giả:</strong> Giấy chứng nhận này KHÔNG BAO GỒM QUYỀN TÁC GIẢ (quyền đối với tác phẩm âm nhạc — giai điệu, lời) và KHÔNG BAO GỒM QUYỀN BẢN GHI. Quyền tác giả do Trung tâm Bảo vệ Quyền tác giả Âm nhạc Việt Nam (VCPMC) đại diện quản lý. Quyền bản ghi do Hiệp hội Công nghiệp Ghi âm Việt Nam (RIAV) đại diện quản lý.
                </p>
                <p className="terms-paragraph">
                  2.3. <strong>Nghĩa vụ độc lập của Đơn vị sử dụng / Người đăng ký:</strong>
                  <br />- Đơn vị sử dụng / Người đăng ký có nghĩa vụ tự liên hệ với VCPMC, RIAV hoặc chủ sở hữu quyền tương ứng của tác phẩm để được cấp phép quyền tác giả, quyền bản ghi trước khi sử dụng.
                </p>
                <p className="terms-paragraph">
                  2.4. <strong>Tính độc lập của khoản phí:</strong> Theo Phụ lục II Nghị định 17/2023/NĐ-CP, và Phụ lục I Nghị định 134/2026/NĐ-CP, biểu giá tiền bản quyền áp dụng tương tự cho chủ sở hữu quyền tác giả và chủ sở hữu quyền liên quan. Hai khoản thu này là độc lập và song song.
                </p>
                <p className="terms-paragraph">
                  2.5 <strong>Miễn trừ trách nhiệm:</strong> Trung tâm không chịu trách nhiệm đối với bất kỳ khiếu nại, tranh chấp hay chế tài pháp lý nào phát sinh từ việc Đơn vị sử dụng / Người đăng ký không thực hiện nghĩa vụ thanh toán quyền tác giả cho VCPMC và RIAV.
                </p>

                <h4 className="terms-section-title">ĐIỀU 3: CƠ CHẾ TỰ KÊ KHAI VÀ TRÁCH NHIỆM CỦA ĐƠN VỊ SỬ DỤNG</h4>
                <p className="terms-paragraph">
                  3.1. <strong>Cơ chế tự kê khai:</strong> Hệ thống cấp phép của Trung tâm hoạt động hoàn toàn theo cơ chế tự kê khai, tự chịu trách nhiệm. Trung tâm không thực hiện thẩm định thực địa tại thời điểm cấp phép.
                </p>
                <p className="terms-paragraph">
                  3.2. <strong>Cam kết tính chính xác và hợp pháp:</strong>
                  <br />- Đơn vị sử dụng / Người đăng ký cam kết toàn bộ thông tin, tài liệu và nội dung kê khai trong hồ sơ đăng ký là đầy đủ, chính xác, trung thực và hợp pháp.
                </p>
                <p className="terms-paragraph">
                  3.3. <strong>Trách nhiệm và Chế tài khi kê khai sai:</strong> Trường hợp kê khai sai, thiếu, giả mạo hoặc gian lận dẫn đến mức phí cấp phép thấp hơn mức thực tế phải nộp, Đơn vị sử dụng / Người đăng ký phải tự chịu trách nhiệm trước pháp luật và nộp bổ sung đầy đủ phần phí chênh lệch kèm theo lãi suất chậm nộp và chế tài xử lý vi phạm hành chính.
                </p>

                <h4 className="terms-section-title">ĐIỀU 4: QUY TRÌNH ĐĂNG KÝ, THANH TOÁN VÀ CẤP PHÉP</h4>
                <p className="terms-paragraph">
                  4.1. <strong>Quy trình 07 bước:</strong> Chọn loại hình &rarr; Kê khai thông tin &rarr; Chấp thuận Điều khoản &rarr; Duyệt đăng ký &rarr; Thanh toán &rarr; Xác nhận &rarr; Cấp Giấy chứng nhận.
                </p>
                <p className="terms-paragraph">
                  4.2. <strong>Thời gian xử lý:</strong> Trung tâm duyệt thông tin trong 72 giờ và phát hành Giấy chứng nhận trong vòng 48 giờ làm việc kể từ khi nhận được chứng từ thanh toán hợp lệ.
                </p>

                <h4 className="terms-section-title">ĐIỀU 5: THỜI HẠN VÀ GIA HẠN</h4>
                <p className="terms-paragraph">
                  5.1. <strong>Thời hạn:</strong> Giấy chứng nhận có giá trị trong thời hạn ghi rõ trên văn bản. Đối với sự kiện biểu diễn, giấy chứng nhận chỉ có giá trị cho 01 sự kiện duy nhất đã kê khai.
                </p>

                <h4 className="terms-section-title">ĐIỀU 6: BẢO MẬT VÀ PHÂN CHIA TIỀN BẢN QUYỀN</h4>
                <p className="terms-paragraph">
                  6.1. <strong>Bảo mật dữ liệu:</strong> Trung tâm cam kết bảo mật thông tin do Đơn vị sử dụng cung cấp theo quy định pháp luật.
                </p>
                <p className="terms-paragraph">
                  6.2. <strong>Phân chia tiền bản quyền:</strong> Tiền bản quyền thu được sau khi trừ phí quản lý sẽ được phân chia theo quy chế của Trung tâm cho chủ sở hữu bản ghi và người biểu diễn.
                </p>

                <h4 className="terms-section-title">ĐIỀU 7: GIẢI QUYẾT TRANH CHẤP</h4>
                <p className="terms-paragraph">
                  7.1. Mọi tranh chấp phát sinh sẽ được giải quyết thông qua thương lượng. Trường hợp không thành, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền tại Việt Nam giải quyết theo pháp luật Việt Nam.
                </p>

                <h4 className="terms-section-title">ĐIỀU 8: ĐIỀU KHOẢN CHUNG</h4>
                <p className="terms-paragraph">
                  8.1. Việc Đơn vị sử dụng đánh dấu (check) vào ô chấp thuận đồng nghĩa với việc đã hiểu rõ và hoàn toàn đồng ý với toàn bộ nội dung Điều khoản sử dụng này, bao gồm cả việc hệ thống tự động ghi nhận các thông số kỹ thuật (IP, thời gian, thiết bị) làm bằng chứng chấp thuận.
                </p>
              </div>
            </div>

            {/* Ô tích cam kết & Nút đóng ở chân modal */}
            <div className="consent-modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <label 
                className="business-checkbox-label" 
                style={{ 
                  cursor: hasScrolledToBottom ? 'pointer' : 'not-allowed',
                  opacity: hasScrolledToBottom ? 1 : 0.5,
                  fontSize: '0.88rem'
                }}
              >
                <input
                  type="checkbox"
                  checked={modalCheckboxChecked}
                  disabled={!hasScrolledToBottom}
                  onChange={(e) => {
                    if (hasScrolledToBottom) {
                      setModalCheckboxChecked(e.target.checked)
                    }
                  }}
                  style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                />
                <span>Tôi đã đọc và đồng ý với nội dung điều khoản dịch vụ & cam kết sử dụng</span>
              </label>

              <button
                type="button"
                className="btn-register-submit"
                disabled={!modalCheckboxChecked}
                onClick={() => {
                  if (modalCheckboxChecked) {
                    setIsAgreed(true)
                    setIsTermsModalOpen(false)
                  }
                }}
                style={{ 
                  minWidth: '160px', 
                  height: '40px', 
                  fontSize: '0.88rem',
                  opacity: modalCheckboxChecked ? 1 : 0.5,
                  cursor: modalCheckboxChecked ? 'pointer' : 'not-allowed'
                }}
              >
                ĐỒNG Ý & TIẾP TỤC
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CopyPage