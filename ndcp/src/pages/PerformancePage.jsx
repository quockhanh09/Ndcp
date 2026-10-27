import { useState } from 'react'
import { cities, getWardsByCity } from '../data/vietnamLocations'

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
  const [songs, setSongs] = useState([
    { id: 1, title: '', author: '', performer: '', link: '' },
    { id: 2, title: '', author: '', performer: '', link: '' },
    { id: 3, title: '', author: '', performer: '', link: '' },
  ])

  // Cam kết
  const [isAgreed, setIsAgreed] = useState(false)

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

  // TÍNH TOÁN PHÍ BẢN QUYỀN THEO CÔNG THỨC
  const calculateFee = () => {
    if (isConcert) {
      // Concert luôn tính theo: 3% * 70% * sức chứa nơi biểu diễn * bình quân giá vé[cite: 24]
      const cap = parseFloat(concertAudience) || 0
      const price = parseFloat(concertTicketPrice) || 0
      return 0.03 * 0.7 * cap * price
    }

    if (ticketMode === 'paid') {
      // Có bán vé: 3% * 70% * sức chứa nơi biểu diễn * bình quân giá vé[cite: 24]
      const cap = parseFloat(venueCapacity) || 0
      const price = parseFloat(avgTicketPrice) || 0
      return 0.03 * 0.7 * cap * price
    } else {
      // Không bán vé: Mức phí cố định * Số lượng tác phẩm sử dụng (ví dụ 500.000đ/tác phẩm)[cite: 25]
      const fixedRatePerSong = 500000
      const totalSongsCount = songs.length
      return fixedRatePerSong * totalSongsCount
    }
  }

  const estimatedFee = calculateFee()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAgreed) return
    alert(`Đăng ký thành công! Dự kiến phí bản quyền: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(estimatedFee)}`)
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

                  </div>
                </div>
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
                                <option key={c.name} value={c.name}>{c.name}</option>
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
                                <option key={w} value={w}>{w}</option>
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
                          Sức chứa nơi biểu diễn <span className="required-star">*</span>
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
                          Bình quân giá vé (VNĐ) <span className="required-star">*</span>
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
                  <button
                    type="button"
                    className="karaoke-room-add-button"
                    onClick={handleAddSong}
                    style={{ padding: '0 16px', height: '36px', fontSize: '0.85rem' }}
                  >
                    + thêm
                  </button>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                </p>

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

                {/* Hiển thị phí tạm tính */}
                <div style={{ marginTop: '16px', color: '#93c5fd', fontSize: '0.95rem', fontWeight: '600' }}>
                  Phí bản quyền ước tính: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(estimatedFee)}
                </div>

                {/* Cam kết & Nút Gửi */}
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
                              <option key={c.name} value={c.name}>{c.name}</option>
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
                              <option key={w} value={w}>{w}</option>
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

                  </div>
                </div>
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
                              <option key={c.name} value={c.name}>{c.name}</option>
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
                              <option key={w} value={w}>{w}</option>
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
                  <button
                    type="button"
                    className="karaoke-room-add-button"
                    onClick={handleAddSong}
                    style={{ padding: '0 16px', height: '36px', fontSize: '0.85rem' }}
                  >
                    + thêm
                  </button>
                </div>
                <p className="business-sub-desc" style={{ marginTop: '0' }}>
                  Vui lòng cung cấp đầy đủ và chính xác các thông tin theo yêu cầu dưới đây.
                </p>

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

                {/* Hiển thị phí tạm tính cho Concert */}
                <div style={{ marginTop: '16px', color: '#93c5fd', fontSize: '0.95rem', fontWeight: '600' }}>
                  Phí bản quyền ước tính: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(estimatedFee)}
                </div>

                {/* Cam kết & Nút Gửi */}
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

export default PerformancePage