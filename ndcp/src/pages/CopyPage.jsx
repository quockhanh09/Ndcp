import { useState, useRef } from 'react'
import { cities, getWardsByCity } from '../data/vietnamLocations'

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
  const [selectedType, setSelectedType] = useState('movie') // Mặc định ban đầu

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
  
  // Để trống ban đầu, chỉ hiện khi có file tải lên
  const [businessLicenseFile, setBusinessLicenseFile] = useState(null)

  // --- CHI TIẾT NỘI DUNG ĐĂNG KÝ (BƯỚC 03 CHO TỪNG LOẠI) ---
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
  const [recordInputMode, setRecordInputMode] = useState('manual') // 'manual' | 'excel'
  
  const [records, setRecords] = useState([
    { id: 1, songTitle: '', albumTitle: '', performer: '', recordLink: '' }
  ])

  // Để trống ban đầu, chỉ hiện khi chọn tải file lên và đã chọn file
  const [excelFile, setExcelFile] = useState(null)

  // Cam kết
  const [isAgreed, setIsAgreed] = useState(false)

  // File input refs
  const licenseFileInputRef = useRef(null)
  const excelFileInputRef = useRef(null)

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
        size: `${(file.size / 1024).toFixed(0)} KB of ${(file.size / 1024).toFixed(0)} KB`,
        status: 'Hoàn tất'
      })
    }
  }

  const handleExcelUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setExcelFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB of ${(file.size / 1024).toFixed(0)} KB`,
        status: 'Hoàn tất'
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAgreed) return
    alert('Đăng ký sử dụng bản quyền thành công!')
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

        {/* CÁC PHẦN FORM KHI ĐÃ CHỌN LOẠI HÌNH */}
        {selectedType !== '' && (
          <>
            {/* PHẦN 02: THÔNG TIN ĐƠN VỊ ĐĂNG KÝ (CHUNG) */}
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
                              <option key={c.name} value={c.name}>{c.name}</option>
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
                              <option key={w} value={w}>{w}</option>
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

                {/* Chỉ hiện khung thông tin file khi đã có file tải lên */}
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

            {/* PHẦN 03: CHI TIẾT NỘI DUNG ĐĂNG KÝ (PHÂN TÁCH RIÊNG THEO TỪNG LOẠI HÌNH) */}
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
                    
                    {/* --- 1. PHIM ĐIỆN ẢNH ('movie') --- */}
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

                    {/* --- 2. QUẢNG CÁO TVC ('tvc') --- */}
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

                    {/* --- 3. ALBUM BIÊN TẬP ('album') --- */}
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

                    {/* --- 4. VIDEO CA NHẠC VÀ CÁC TÁC PHẨM NGHE NHÌN ('mv_audiovisual') --- */}
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

                    {/* --- 5. MÁY CHƠI GAME ARCADE ('arcade') --- */}
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

            {/* PHẦN 04: DANH SÁCH CÁC BẢN GHI ĐĂNG KÝ SỬ DỤNG (CHUNG) */}
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

                    {/* Chỉ hiện khung thông tin file khi người dùng đã chọn file */}
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
                    <span>Tôi cam kết các thông tin đăng ký là đúng sự thật và hoàn toàn chịu trách nhiệm trước pháp luật</span>
                  </label>

                  <div className="business-submit-wrapper" style={{ marginTop: '8px' }}>
                    <button
                      type="submit"
                      className="btn-register-submit"
                      disabled={!isAgreed}
                    >
                      ĐĂNG KÝ SỬ DỤNG
                    </button>
                  </div>
                </div>

              </div>
            </section>
          </>
        )}

      </form>
    </div>
  )
}

export default CopyPage