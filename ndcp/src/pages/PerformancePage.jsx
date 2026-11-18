import { useState, useRef } from 'react'
import { cities, getWardsByCity } from '../data/vietnamLocations'
import * as XLSX from 'xlsx'
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

const performanceTypes = [
  { id: 'hotel_4plus', label: 'Khách sạn 4 sao trở lên (không sử dụng live band)' },
  { id: 'hotel_3minus', label: 'Khách sạn 3 sao trở xuống (không sử dụng live band)' },
  { id: 'tea_room', label: 'Phòng trà nhà hàng, quán cà phê, vũ trường hoặc các dịch vụ tương tự (không sử dụng live band)' },
  { id: 'concert', label: 'Concert (có sử dụng bản ghi)' },
]

function PerformancePage() {
  const [selectedType, setSelectedType] = useState('')
  const [ticketMode, setTicketMode] = useState('free') // 'paid' | 'free'

  // Khai báo trước các biến xác định loại hình để tránh lỗi ReferenceError
  const isConcert = selectedType === 'concert'
  const isHotelOrTeaRoom = ['hotel_4plus', 'hotel_3minus', 'tea_room'].includes(selectedType)

  // --- THÔNG TIN ĐƠN VỊ TỔ CHỨC ---
  const [orgName, setOrgName] = useState('')
  const [mst, setMst] = useState('')
  
  // Dành cho Khách sạn / Phòng trà
  const [legalRep, setLegalRep] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+84')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [orgCity, setOrgCity] = useState('')
  const [orgWard, setOrgWard] = useState('')
  const [orgStreet, setOrgStreet] = useState('')

  // File giấy phép kinh doanh (cho khách sạn / phòng trà)
  const [businessLicenseFile, setBusinessLicenseFile] = useState(null)
  const licenseFileInputRef = useRef(null)

  // File giấy phép kinh doanh (cho concert)
  const [concertLicenseFile, setConcertLicenseFile] = useState(null)
  const concertLicenseFileInputRef = useRef(null)

  // --- THÔNG TIN CHƯƠNG TRÌNH BIỂU DIỄN (KHI CÓ BÁN VÉ) ---
  const [showProgramName, setShowProgramName] = useState('')
  const [showProgramTime, setShowProgramTime] = useState('')
  const [showCity, setShowCity] = useState('')
  const [showWard, setShowWard] = useState('')
  const [showStreet, setShowStreet] = useState('')
  
  // Biến phục vụ công thức tính phí có bán vé
  const [venueCapacity, setVenueCapacity] = useState('') // sức chứa nơi biểu diễn
  const [avgTicketPrice, setAvgTicketPrice] = useState('') // bình quân giá vé

  // Dành riêng cho Concert
  const [representative, setRepresentative] = useState('')
  const [legalRepresentative, setLegalRepresentative] = useState('')
  const [contactPhonePrefix, setContactPhonePrefix] = useState('+84')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactName, setContactName] = useState('')
  const [position, setPosition] = useState('')
  const [contactPersonPhonePrefix, setContactPersonPhonePrefix] = useState('+84')
  const [contactPersonPhone, setContactPersonPhone] = useState('')
  const [contactPersonEmail, setContactPersonEmail] = useState('')
  const [contactCity, setContactCity] = useState('')
  const [contactWard, setContactWard] = useState('')
  const [contactStreet, setContactStreet] = useState('')

  // Concert program info
  const [concertProgramName, setConcertProgramName] = useState('')
  const [concertTime, setConcertTime] = useState('')
  const [concertCity, setConcertCity] = useState('')
  const [concertWard, setConcertWard] = useState('')
  const [concertStreet, setConcertStreet] = useState('')
  const [concertAudience, setConcertAudience] = useState('')
  const [concertTicketPrice, setConcertTicketPrice] = useState('')

  // --- DANH SÁCH TÁC PHẨM BIỂU DIỄN ---
  const [recordInputMode, setRecordInputMode] = useState('manual') // 'manual' | 'excel'
  const [songs, setSongs] = useState([
    { id: 1, title: '', author: '', performer: '', link: '' },
    { id: 2, title: '', author: '', performer: '', link: '' },
    { id: 3, title: '', author: '', performer: '', link: '' },
  ])
  
  const [excelFile, setExcelFile] = useState(null)
  const [excelSongsCount, setExcelSongsCount] = useState(0) // Số lượng bài hát hợp lệ đọc được từ file Excel
  const excelFileInputRef = useRef(null)

  // Cam kết & Modal điều khoản
  const [isAgreed, setIsAgreed] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [modalCheckboxChecked, setModalCheckboxChecked] = useState(false)
  const termsScrollRef = useRef(null)

  // Trạng thái gửi đăng ký về APPA CMS
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [registrationInfo, setRegistrationInfo] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

  const handleAddSong = () => {
    setSongs([
      ...songs,
      { id: Date.now(), title: '', author: '', performer: '', link: '' }
    ])
  }

  const handleDeleteSong = (id) => {
    if (songs.length === 1) return
    setSongs(songs.filter(s => s.id !== id))
  }

  const handleSongChange = (id, field, value) => {
    setSongs(songs.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleLicenseUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBusinessLicenseFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB of ${(file.size / 1024).toFixed(0)} KB`,
        status: 'Hoàn tất'
      })
    }
  }

  const handleConcertLicenseUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setConcertLicenseFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB of ${(file.size / 1024).toFixed(0)} KB`,
        status: 'Hoàn tất'
      })
    }
  }

  // Đọc file Excel và đếm số hàng hợp lệ dựa theo biểu mẫu
  const handleExcelUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        let validCount = 0
        for (let i = 3; i < jsonData.length; i++) {
          const row = jsonData[i]
          if (!row) continue
          
          const songTitle = row[1] ? String(row[1]).trim() : ''
          const performer = row[3] ? String(row[3]).trim() : ''
          const recordLink = row[4] ? String(row[4]).trim() : ''

          if (songTitle !== '' && performer !== '' && recordLink !== '') {
            validCount++
          }
        }

        setExcelSongsCount(validCount)
        setExcelFile({
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          status: 'Hoàn tất'
        })
      } catch (error) {
        console.error('Lỗi đọc file Excel:', error)
        alert('Không thể đọc file Excel. Vui lòng kiểm tra lại định dạng tệp.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const validSongsCount = songs.filter(
    (song) => 
      song.title.trim() !== '' && 
      song.author.trim() !== '' && 
      song.performer.trim() !== '' && 
      song.link.trim() !== ''
  ).length

  const totalEffectiveSongs = recordInputMode === 'manual' ? validSongsCount : excelSongsCount

  // Đơn giá cố định mỗi tác phẩm khi không bán vé: KS 4 sao trở lên 600.000đ, KS 3 sao trở xuống 400.000đ, Phòng trà/nhà hàng/quán cà phê/vũ trường 250.000đ
  const isHotelType = ['hotel_4plus', 'hotel_3minus', 'tea_room'].includes(selectedType)
  const fixedRatePerSong = selectedType === 'hotel_3minus' ? 400000 : selectedType === 'tea_room' ? 250000 : 600000
  const ownershipRatio = 1 // Tỷ lệ sở hữu giả định 100%

  const calculateFee = () => {
    if (isConcert) {
      const cap = parseFloat(concertAudience) || 0
      const price = parseFloat(concertTicketPrice) || 0
      return 0.03 * 0.7 * cap * price * ownershipRatio
    }

    if (ticketMode === 'paid') {
      const cap = parseFloat(venueCapacity) || 0
      const price = parseFloat(avgTicketPrice) || 0
      return 0.03 * 0.7 * cap * price
    } else {
      return fixedRatePerSong * totalEffectiveSongs * ownershipRatio
    }
  }

  const estimatedFee = calculateFee()

  const buildAddress = (cityId, wardName, street) => {
    const cityName = cities.find((c) => c.id === cityId)?.name || ''
    return `${street.trim()}${street.trim() ? ', ' : ''}${wardName}${wardName ? ', ' : ''}${cityName}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAgreed || isSubmitting) return
    setIsSubmitting(true)
    setRegistrationError('')

    const randomNumber = Math.floor(100000 + Math.random() * 900000)
    const now = new Date()
    const orderNumber = getNextDailyOrderNumber(now)
    const registrationCode = `APPA-CMC-BD-${randomNumber}-${orderNumber}`

    const validSongs = songs
      .filter((s) => s.title.trim() && s.author.trim() && s.performer.trim() && s.link.trim())
      .map((s) => ({
        title: s.title.trim(),
        author: s.author.trim(),
        performer: s.performer.trim(),
        link: s.link.trim(),
      }))

    const payload = {
      registrationCode,
      performanceType: selectedType,
      performanceTypeLabel: getSelectedTypeLabel(),
      ticketMode: isConcert ? 'paid' : ticketMode,
      orgName: orgName.trim(),
      taxCode: mst.trim(),
      orgAddress: buildAddress(orgCity, orgWard, orgStreet),
      representative: isConcert ? representative.trim() : '',
      legalRepresentative: (isConcert ? legalRepresentative : legalRep).trim(),
      phone: isConcert ? `${contactPhonePrefix} ${contactPhone}`.trim() : `${phonePrefix} ${phone}`.trim(),
      email: (isConcert ? contactEmail : email).trim(),
      programName: (isConcert ? concertProgramName : showProgramName).trim(),
      programTime: isConcert ? concertTime : showProgramTime,
      programAddress: isConcert
        ? buildAddress(concertCity, concertWard, concertStreet)
        : buildAddress(showCity, showWard, showStreet),
      venueCapacity: isConcert
        ? parseFloat(concertAudience) || null
        : ticketMode === 'paid' ? parseFloat(venueCapacity) || null : null,
      avgTicketPrice: isConcert
        ? parseFloat(concertTicketPrice) || null
        : ticketMode === 'paid' ? parseFloat(avgTicketPrice) || null : null,
      contactName: isConcert ? contactName.trim() : '',
      contactPosition: isConcert ? position.trim() : '',
      contactPhone: isConcert ? `${contactPersonPhonePrefix} ${contactPersonPhone}`.trim() : '',
      contactEmail: isConcert ? contactPersonEmail.trim() : '',
      contactAddress: isConcert ? buildAddress(contactCity, contactWard, contactStreet) : '',
      songsCount: totalEffectiveSongs,
      songs: recordInputMode === 'manual' ? validSongs : [],
      feeAmount: Math.round(estimatedFee || 0),
      fileName: (isConcert ? concertLicenseFile?.name : businessLicenseFile?.name) || '',
      fileMimeType: '',
    }

    try {
      const response = await fetch(`${API_BASE_URL}/performance-registrations`, {
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
        registrantName: payload.legalRepresentative || payload.orgName,
        time: formatRegistrationTime(now),
      })
      setIsSuccessModalOpen(true)
    } catch (err) {
      setRegistrationError(err.message || 'Không thể gửi hồ sơ đến APPA CMS')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSelectedTypeLabel = () => {
    const found = performanceTypes.find(t => t.id === selectedType)
    return found ? found.label : ''
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
                    Loại hình biểu diễn âm nhạc <span className="required-star">*</span>
                  </label>
                  <div className="business-input-wrapper select-wrapper performance-select">
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="" disabled>
                        Chọn loại hình biểu diễn âm nhạc
                      </option>
                      {performanceTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedType !== '' && !isConcert && (
                  <div className="business-form-field full-width performance-ticket-field">
                    <div className="ticket-mode-group-row" style={{ display: 'flex', gap: '24px', alignItems: 'center', marginTop: '4px' }}>
                      <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="ticketMode"
                          checked={ticketMode === 'paid'}
                          onChange={() => setTicketMode('paid')}
                          style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                        />
                        <span>Có bán vé (thương mại)</span>
                      </label>

                      <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="ticketMode"
                          checked={ticketMode === 'free'}
                          onChange={() => setTicketMode('free')}
                          style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                        />
                        <span>Không bán vé</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FORM CHO KHÁCH SẠN / PHÒNG TRÀ */}
        {isHotelOrTeaRoom && (
          <>
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head">
                  <span className="register-step-number">02</span>
                  <h3>THÔNG TIN ĐƠN VỊ TỔ CHỨC</h3>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                </p>

                <div className="business-form-container">
                  <div className="business-form-grid">
                    
                    <div className="business-form-field">
                      <label className="business-form-label">
                        Tên đơn vị tổ chức <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          required
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
                          placeholder="text input"
                          value={mst}
                          onChange={(e) => setMst(e.target.value)}
                          required
                        />
                      </div>
                    </div>

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

            {/* THÔNG TIN CHƯƠNG TRÌNH BIỂU DIỄN (HIỆN KHI CÓ BÁN VÉ) */}
            {ticketMode === 'paid' && (
              <section className="register-panel-card">
                <div className="register-section">
                  <div className="register-section-head">
                    <span className="register-step-number">03</span>
                    <h3>THÔNG TIN CHƯƠNG TRÌNH BIỂU DIỄN</h3>
                  </div>
                  <p className="business-sub-desc" style={{ marginTop: '0' }}>
                    Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                  </p>

                  <div className="business-form-container">
                    <div className="business-form-grid">
                      
                      <div className="business-form-field">
                        <label className="business-form-label">
                          Tên chương trình <span className="required-star">*</span>
                        </label>
                        <div className="business-input-wrapper">
                          <input
                            type="text"
                            placeholder="text input"
                            value={showProgramName}
                            onChange={(e) => setShowProgramName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="business-form-field">
                        <label className="business-form-label">
                          Thời gian <span className="required-star">*</span>
                        </label>
                        <div className="business-input-wrapper">
                          <input
                            type="text"
                            placeholder="text input"
                            value={showProgramTime}
                            onChange={(e) => setShowProgramTime(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="business-form-field full-width">
                        <label className="business-form-label">
                          Địa điểm tổ chức <span className="required-star">*</span>
                        </label>
                        <div className="business-address-row" style={{ marginBottom: '12px' }}>
                          <div className="business-input-wrapper select-wrapper">
                            <select
                              value={showCity}
                              onChange={(e) => {
                                setShowCity(e.target.value)
                                setShowWard('')
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
                              value={showWard}
                              onChange={(e) => setShowWard(e.target.value)}
                              required
                            >
                              <option value="">Chọn phường / xã</option>
                              {getWardsByCity(showCity).map((w) => (
                                <option key={w.id} value={w.name}>{w.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="business-input-wrapper business-address-street">
                          <input
                            type="text"
                            placeholder="Nhập số nhà, tên đường"
                            value={showStreet}
                            onChange={(e) => setShowStreet(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="business-form-field">
                        <label className="business-form-label">
                          Số khán giả dự kiến <span className="required-star">*</span>
                        </label>
                        <div className="business-input-wrapper">
                          <input
                            type="number"
                            placeholder="Nhập số lượng chỗ ngồi / sức chứa"
                            value={venueCapacity}
                            onChange={(e) => setVenueCapacity(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="business-form-field">
                        <label className="business-form-label">
                          Giá vé dự kiến (VNĐ) <span className="required-star">*</span>
                        </label>
                        <div className="business-input-wrapper">
                          <input
                            type="number"
                            placeholder="Nhập giá vé bình quân"
                            value={avgTicketPrice}
                            onChange={(e) => setAvgTicketPrice(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* DANH SÁCH TÁC PHẨM BIỂU DIỄN */}
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="register-step-number">{ticketMode === 'paid' ? '04' : '03'}</span>
                    <h3>DANH SÁCH TÁC PHẨM BIỂU DIỄN</h3>
                  </div>
                  {recordInputMode === 'manual' && (
                    <button
                      type="button"
                      className="karaoke-room-add-button"
                      onClick={handleAddSong}
                      style={{ padding: '0 16px', height: '36px', fontSize: '0.85rem' }}
                    >
                      + thêm
                    </button>
                  )}
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp danh sách bản ghi sử dụng bằng cách nhập thông tin hoặc tải lên file (định dạng .excel)
                </p>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'center', margin: '12px 0 16px' }}>
                  <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recordInputModeHotel"
                      checked={recordInputMode === 'manual'}
                      onChange={() => setRecordInputMode('manual')}
                      style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                    />
                    <span>Nhập thông tin</span>
                  </label>

                  <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recordInputModeHotel"
                      checked={recordInputMode === 'excel'}
                      onChange={() => setRecordInputMode('excel')}
                      style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                    />
                    <span>Tải lên file (.excel)</span>
                  </label>
                </div>

                {recordInputMode === 'manual' && (
                  <div className="business-form-container">
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {songs.map((song, index) => (
                        <div
                          key={song.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto',
                            gap: '12px',
                            alignItems: 'end',
                            paddingBottom: index < songs.length - 1 ? '16px' : '0',
                            borderBottom: index < songs.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                          }}
                        >
                          <div className="business-form-field">
                            <label className="business-form-label">Tên bài hát / Tác phẩm <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={song.title}
                                onChange={(e) => handleSongChange(song.id, 'title', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="business-form-field">
                            <label className="business-form-label">Tác giả <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={song.author}
                                onChange={(e) => handleSongChange(song.id, 'author', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="business-form-field">
                            <label className="business-form-label">Nghệ sĩ biểu diễn <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={song.performer}
                                onChange={(e) => handleSongChange(song.id, 'performer', e.target.value)}
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
                                value={song.link}
                                onChange={(e) => handleSongChange(song.id, 'link', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
                            <button
                              type="button"
                              className="karaoke-room-delete-button"
                              onClick={() => handleDeleteSong(song.id)}
                              disabled={songs.length === 1}
                              style={{ opacity: songs.length === 1 ? 0.4 : 1 }}
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
                                ✓ {excelFile.status} (Đã nhận diện {excelSongsCount} tác phẩm hợp lệ)
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setExcelFile(null)
                            setExcelSongsCount(0)
                          }}
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

                {/* KHU VỰC HIỂN THỊ CÔNG THỨC TÍNH CHI PHÍ */}
                {ticketMode === 'free' ? (
                  <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <h3 className="fee-formula-title" style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '0.02em' }}>
                      CÔNG THỨC TÍNH CHI PHÍ <span style={{ color: '#ef4444' }}>*</span>
                    </h3>
                    <div className="fee-formula-subtitle" style={{ color: '#93c5fd', fontSize: '0.95rem', fontWeight: '600', marginBottom: '20px', fontStyle: 'italic' }}>
                      {getSelectedTypeLabel()} (không bán vé)
                    </div>

                    <div className="fee-formula-box" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '24px 20px'
                    }}>
                      <span className="fee-formula-value" style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>{new Intl.NumberFormat('vi-VN').format(fixedRatePerSong)} VNĐ</span>
                      <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                      <div className="fee-formula-chip" style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        {recordInputMode === 'manual' ? `Số lượng tác phẩm sử dụng (${validSongsCount})` : `Số lượng tác phẩm trong file Excel (${excelSongsCount})`}
                      </div>
                      {isHotelType && (
                        <>
                          <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                          <div className="fee-formula-chip" style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '12px',
                            padding: '12px 20px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                          }}>
                            Tỷ lệ sở hữu (giả định 100%)
                          </div>
                        </>
                      )}
                      <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>=</span>
                      <div className="fee-formula-result" style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        color: '#4ade80',
                        fontSize: '1rem',
                        fontWeight: '700'
                      }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(estimatedFee)}
                      </div>
                    </div>
                    {isHotelType && (
                      <p style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                        Thông tin thanh toán chi phí cần trả cụ thể sẽ được thông báo qua email.
                      </p>
                    )}
                  </div>
                ) : (
                  <div style={{ marginTop: '32px', textAlign: 'center' }}>
                    <h3 className="fee-formula-title" style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '0.02em' }}>
                      CÔNG THỨC TÍNH CHI PHÍ <span style={{ color: '#ef4444' }}>*</span>
                    </h3>
                    <div className="fee-formula-subtitle" style={{ color: '#93c5fd', fontSize: '0.95rem', fontWeight: '600', marginBottom: '20px', fontStyle: 'italic' }}>
                      Loại hình biểu diễn âm nhạc có bán vé
                    </div>

                    <div className="fee-formula-box" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '24px 20px'
                    }}>
                      <span className="fee-formula-value" style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>3%</span>
                      <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                      <span className="fee-formula-value" style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>70%</span>
                      <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                      <div className="fee-formula-chip" style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        {venueCapacity ? `Sức chứa: ${venueCapacity}` : 'Sức chứa nơi biểu diễn'}
                      </div>
                      <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                      <div className="fee-formula-chip" style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.95rem',
                        fontWeight: '600'
                      }}>
                        {avgTicketPrice ? `Giá vé: ${new Intl.NumberFormat('vi-VN').format(avgTicketPrice)} ₫` : 'Bình quân giá vé'}
                      </div>
                      <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>=</span>
                      <div className="fee-formula-result" style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        padding: '12px 20px',
                        color: '#4ade80',
                        fontSize: '1rem',
                        fontWeight: '700'
                      }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(estimatedFee)}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cam kết & Nút Gửi */}
                <div className="business-commitment-container" style={{ marginTop: '32px' }}>
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

        {/* FORM CHO CONCERT */}
        {isConcert && (
          <>
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head">
                  <span className="register-step-number">02</span>
                  <h3>THÔNG TIN ĐƠN VỊ TỔ CHỨC</h3>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                </p>

                <div className="business-form-container">
                  <div className="business-form-grid">
                    
                    <div className="business-form-field">
                      <label className="business-form-label">
                        Tên đơn vị tổ chức <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        MST / Giấy ĐKKD <span className="required-star">*</span>
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
                        Người đại diện <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={representative}
                          onChange={(e) => setRepresentative(e.target.value)}
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
                          value={legalRepresentative}
                          onChange={(e) => setLegalRepresentative(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Số điện thoại <span className="required-star">*</span>
                      </label>
                      <div className="business-phone-group">
                        <div className="business-input-wrapper select-wrapper phone-prefix-wrapper">
                          <select
                            value={contactPhonePrefix}
                            onChange={(e) => setContactPhonePrefix(e.target.value)}
                          >
                            <option value="+84">+84</option>
                            <option value="+1">+1</option>
                          </select>
                        </div>
                        <div className="business-input-wrapper phone-input-wrapper">
                          <input
                            type="text"
                            placeholder="number input"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Email <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="email"
                          placeholder="text input"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

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

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Họ tên người liên hệ <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Chức vụ <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={position}
                          onChange={(e) => setPosition(e.target.value)}
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
                            value={contactPersonPhonePrefix}
                            onChange={(e) => setContactPersonPhonePrefix(e.target.value)}
                          >
                            <option value="+84">+84</option>
                            <option value="+1">+1</option>
                          </select>
                        </div>
                        <div className="business-input-wrapper phone-input-wrapper">
                          <input
                            type="text"
                            placeholder="number input"
                            value={contactPersonPhone}
                            onChange={(e) => setContactPersonPhone(e.target.value)}
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
                          value={contactPersonEmail}
                          onChange={(e) => setContactPersonEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field full-width">
                      <label className="business-form-label">
                        Địa chỉ liên hệ <span className="required-star">*</span>
                      </label>
                      <div className="business-address-row" style={{ marginBottom: '12px' }}>
                        <div className="business-input-wrapper select-wrapper">
                          <select
                            value={contactCity}
                            onChange={(e) => {
                              setContactCity(e.target.value)
                              setContactWard('')
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
                            value={contactWard}
                            onChange={(e) => setContactWard(e.target.value)}
                            required
                          >
                            <option value="">Chọn phường / xã</option>
                            {getWardsByCity(contactCity).map((w) => (
                              <option key={w.id} value={w.name}>{w.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="business-input-wrapper business-address-street">
                        <input
                          type="text"
                          placeholder="Nhập số nhà, tên đường"
                          value={contactStreet}
                          onChange={(e) => setContactStreet(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field full-width" style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                      <input
                        type="file"
                        ref={concertLicenseFileInputRef}
                        onChange={handleConcertLicenseUpload}
                        accept=".pdf,.doc,.docx,.png,.jpg"
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => concertLicenseFileInputRef.current?.click()}
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

                {concertLicenseFile && (
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
                          {concertLicenseFile.name}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{concertLicenseFile.size}</span>
                          <span>•</span>
                          <span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            ✓ {concertLicenseFile.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConcertLicenseFile(null)}
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

            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head">
                  <span className="register-step-number">03</span>
                  <h3>THÔNG TIN CHƯƠNG TRÌNH BIỂU DIỄN</h3>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                </p>

                <div className="business-form-container">
                  <div className="business-form-grid">
                    
                    <div className="business-form-field">
                      <label className="business-form-label">
                        Tên chương trình <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={concertProgramName}
                          onChange={(e) => setConcertProgramName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Thời gian <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={concertTime}
                          onChange={(e) => setConcertTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field full-width">
                      <label className="business-form-label">
                        Địa điểm tổ chức <span className="required-star">*</span>
                      </label>
                      <div className="business-address-row" style={{ marginBottom: '12px' }}>
                        <div className="business-input-wrapper select-wrapper">
                          <select
                            value={concertCity}
                            onChange={(e) => {
                              setConcertCity(e.target.value)
                              setConcertWard('')
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
                            value={concertWard}
                            onChange={(e) => setConcertWard(e.target.value)}
                            required
                          >
                            <option value="">Chọn phường / xã</option>
                            {getWardsByCity(concertCity).map((w) => (
                              <option key={w.id} value={w.name}>{w.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="business-input-wrapper business-address-street">
                        <input
                          type="text"
                          placeholder="Nhập số nhà, tên đường"
                          value={concertStreet}
                          onChange={(e) => setConcertStreet(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Sức chứa / Số khán giả dự kiến <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="number"
                          placeholder="text input"
                          value={concertAudience}
                          onChange={(e) => setConcertAudience(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Bình quân giá vé dự kiến <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="number"
                          placeholder="text input"
                          value={concertTicketPrice}
                          onChange={(e) => setConcertTicketPrice(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="register-step-number">04</span>
                    <h3>DANH SÁCH TÁC PHẨM BIỂU DIỄN</h3>
                  </div>
                  {recordInputMode === 'manual' && (
                    <button
                      type="button"
                      className="karaoke-room-add-button"
                      onClick={handleAddSong}
                      style={{ padding: '0 16px', height: '36px', fontSize: '0.85rem' }}
                    >
                      + thêm
                    </button>
                  )}
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp danh sách bản ghi sử dụng bằng cách nhập thông tin hoặc tải lên file (định dạng .excel)
                </p>

                <div style={{ display: 'flex', gap: '32px', alignItems: 'center', margin: '12px 0 16px' }}>
                  <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recordInputModeConcert"
                      checked={recordInputMode === 'manual'}
                      onChange={() => setRecordInputMode('manual')}
                      style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                    />
                    <span>Nhập thông tin</span>
                  </label>

                  <label className="business-checkbox-label" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recordInputModeConcert"
                      checked={recordInputMode === 'excel'}
                      onChange={() => setRecordInputMode('excel')}
                      style={{ width: '18px', height: '18px', accentColor: '#ffffff' }}
                    />
                    <span>Tải lên file (.excel)</span>
                  </label>
                </div>

                {recordInputMode === 'manual' && (
                  <div className="business-form-container">
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {songs.map((song, index) => (
                        <div
                          key={song.id}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto',
                            gap: '12px',
                            alignItems: 'end',
                            paddingBottom: index < songs.length - 1 ? '16px' : '0',
                            borderBottom: index < songs.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                          }}
                        >
                          <div className="business-form-field">
                            <label className="business-form-label">Tên bài hát / Tác phẩm <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={song.title}
                                onChange={(e) => handleSongChange(song.id, 'title', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="business-form-field">
                            <label className="business-form-label">Tác giả <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={song.author}
                                onChange={(e) => handleSongChange(song.id, 'author', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="business-form-field">
                            <label className="business-form-label">Nghệ sĩ biểu diễn <span className="required-star">*</span></label>
                            <div className="business-input-wrapper">
                              <input
                                type="text"
                                placeholder="text input"
                                value={song.performer}
                                onChange={(e) => handleSongChange(song.id, 'performer', e.target.value)}
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
                                value={song.link}
                                onChange={(e) => handleSongChange(song.id, 'link', e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
                            <button
                              type="button"
                              className="karaoke-room-delete-button"
                              onClick={() => handleDeleteSong(song.id)}
                              disabled={songs.length === 1}
                              style={{ opacity: songs.length === 1 ? 0.4 : 1 }}
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
                                ✓ {excelFile.status} (Đã nhận diện {excelSongsCount} tác phẩm hợp lệ)
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setExcelFile(null)
                            setExcelSongsCount(0)
                          }}
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

                {/* Khung công thức cho Concert */}
                <div style={{ marginTop: '32px', textAlign: 'center' }}>
                  <h3 className="fee-formula-title" style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '0.02em' }}>
                    CÔNG THỨC TÍNH CHI PHÍ <span style={{ color: '#ef4444' }}>*</span>
                  </h3>
                  <div className="fee-formula-subtitle" style={{ color: '#93c5fd', fontSize: '0.95rem', fontWeight: '600', marginBottom: '20px', fontStyle: 'italic' }}>
                    Loại hình biểu diễn âm nhạc có bán vé
                  </div>

                  <div className="fee-formula-box" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    flexWrap: 'wrap',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '24px 20px'
                  }}>
                    <span className="fee-formula-value" style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>3%</span>
                    <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                    <span className="fee-formula-value" style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '700' }}>70%</span>
                    <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                    <div className="fee-formula-chip" style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.95rem',
                      fontWeight: '600'
                    }}>
                      {concertAudience ? `Sức chứa: ${concertAudience}` : 'Sức chứa nơi biểu diễn'}
                    </div>
                    <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                    <div className="fee-formula-chip" style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.95rem',
                      fontWeight: '600'
                    }}>
                      {concertTicketPrice ? `Giá vé: ${new Intl.NumberFormat('vi-VN').format(concertTicketPrice)} ₫` : 'Bình quân giá vé'}
                    </div>
                    <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>X</span>
                    <div className="fee-formula-chip" style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.95rem',
                      fontWeight: '600'
                    }}>
                      Tỷ lệ sở hữu (giả định 100%)
                    </div>
                    <span className="fee-formula-operator" style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', fontWeight: '800' }}>=</span>
                    <div className="fee-formula-result" style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '12px 20px',
                      color: '#4ade80',
                      fontSize: '1rem',
                      fontWeight: '700'
                    }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(estimatedFee)}
                    </div>
                  </div>
                  <p style={{ marginTop: '16px', color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                    Thông tin thanh toán chi phí cần trả cụ thể sẽ được thông báo qua email.
                  </p>
                </div>

                {/* Cam kết & Nút Gửi */}
                <div className="business-commitment-container" style={{ marginTop: '32px' }}>
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

            {/* Ô tích cam kết & Nút đóng ở chân modal (giống ảnh mẫu) */}
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

export default PerformancePage