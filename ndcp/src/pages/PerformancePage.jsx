import { useState } from 'react'
import { cities, getWardsByCity } from '../data/vietnamLocations'

const performanceTypes = [
  { id: 'hotel_4plus', label: 'Khách sạn 4 sao trở lên (không sử dụng live band)' },
  { id: 'hotel_3minus', label: 'Khách sạn 3 sao trở xuống (không sử dụng live band)' },
  { id: 'tea_room', label: 'Phòng trà nhà hàng, quán cà phê, vũ trường hoặc các dịch vụ tương tự (không sử dụng live band)' },
  { id: 'concert', label: 'Concert (có sử dụng bản ghi)' },
]

function PerformancePage() {
  // Ban đầu chưa chọn loại hình nào
  const [selectedType, setSelectedType] = useState('')
  const [ticketMode, setTicketMode] = useState('paid') // 'paid' | 'free'

  // --- THÔNG TIN ĐƠN VỊ TỔ CHỨC ---
  const [orgName, setOrgName] = useState('')
  const [mst, setMst] = useState('')
  
  // Dành cho Khách sạn / Phòng trà
  const [legalRep, setLegalRep] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+84')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [programName, setProgramName] = useState('')
  const [programTime, setProgramTime] = useState('')
  const [orgCity, setOrgCity] = useState('')
  const [orgWard, setOrgWard] = useState('')
  const [orgStreet, setOrgStreet] = useState('')
  const [perfCity, setPerfCity] = useState('')
  const [perfWard, setPerfWard] = useState('')
  const [perfStreet, setPerfStreet] = useState('')

  // Dành riêng cho Concert
  const [representative, setRepresentative] = useState('')
  const [legalRepresentative, setLegalRepresentative] = useState('')
  const [contactPhonePrefix, setContactPhonePrefix] = useState('+84')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  
  // Người liên hệ (Concert)
  const [contactName, setContactName] = useState('')
  const [position, setPosition] = useState('')
  const [contactPersonPhonePrefix, setContactPersonPhonePrefix] = useState('+84')
  const [contactPersonPhone, setContactPersonPhone] = useState('')
  const [contactPersonEmail, setContactPersonEmail] = useState('')
  
  // Địa chỉ liên hệ (Concert)
  const [contactCity, setContactCity] = useState('')
  const [contactWard, setContactWard] = useState('')
  const [contactStreet, setContactStreet] = useState('')

  // --- THÔNG TIN CHƯƠNG TRÌNH BIỂU DIỄN (CONCERT) ---
  const [concertProgramName, setConcertProgramName] = useState('')
  const [concertTime, setConcertTime] = useState('')
  const [concertCity, setConcertCity] = useState('')
  const [concertWard, setConcertWard] = useState('')
  const [concertStreet, setConcertStreet] = useState('')
  const [expectedAudience, setExpectedAudience] = useState('')
  const [expectedTicketPrice, setExpectedTicketPrice] = useState('')

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAgreed) return
    alert('Đăng ký thành công!')
  }

  const isHotelOrTeaRoom = ['hotel_4plus', 'hotel_3minus', 'tea_room'].includes(selectedType)
  const isConcert = selectedType === 'concert'

  return (
    <div className="register-page-shell">
      <form onSubmit={handleSubmit} className="register-page-shell">
        
        {/* PHẦN 01: LOẠI HÌNH KINH DOANH (LUÔN HIỂN THỊ) */}
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

                {/* TÙY CHỌN BÁN VÉ CHỈ HIỂN THỊ KHI ĐÃ CHỌN LOẠI HÌNH */}
                {selectedType !== '' && (
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

        {/* ------------------------------------------------------------- */}
        {/* FORM MẪU 1: KHÁCH SẠN / PHÒNG TRÀ KHÔNG CÓ LIVE BAND          */}
        {/* ------------------------------------------------------------- */}
        {isHotelOrTeaRoom && (
          <>
            {/* PHẦN 02: THÔNG TIN ĐƠN VỊ TỔ CHỨC */}
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

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Tên chương trình <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={programName}
                          onChange={(e) => setProgramName(e.target.value)}
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
                          value={programTime}
                          onChange={(e) => setProgramTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field full-width">
                      <label className="business-form-label">
                        Địa điểm biểu diễn âm nhạc <span className="required-star">*</span>
                      </label>
                      <div className="business-address-row" style={{ marginBottom: '12px' }}>
                        <div className="business-input-wrapper select-wrapper">
                          <select
                            value={perfCity}
                            onChange={(e) => {
                              setPerfCity(e.target.value)
                              setPerfWard('')
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
                            value={perfWard}
                            onChange={(e) => setPerfWard(e.target.value)}
                            required
                          >
                            <option value="">Chọn phường / xã</option>
                            {getWardsByCity(perfCity).map((w) => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="business-input-wrapper business-address-street">
                        <input
                          type="text"
                          placeholder="Nhập số nhà, tên đường"
                          value={perfStreet}
                          onChange={(e) => setPerfStreet(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN 03: DANH SÁCH TÁC PHẨM BIỂU DIỄN */}
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="register-step-number">03</span>
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

        {/* ------------------------------------------------------------- */}
        {/* FORM MẪU 2: CONCERT (CÓ SỬ DỤNG BẢN GHI)                       */}
        {/* ------------------------------------------------------------- */}
        {isConcert && (
          <>
            {/* PHẦN 02: THÔNG TIN ĐƠN VỊ TỔ CHỨC */}
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
                    
                    {/* Tên đơn vị tổ chức & MST / Giấy ĐKKD */}
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

                    {/* Người đại diện & Người đại diện pháp luật */}
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

                    {/* Số điện thoại & Email */}
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

                    {/* Địa chỉ trụ sở */}
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

                    {/* Họ tên người liên hệ & Chức vụ */}
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

                    {/* Số điện thoại liên hệ & Email liên hệ */}
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

                    {/* Địa chỉ liên hệ */}
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

            {/* PHẦN 03: THÔNG TIN CHƯƠNG TRÌNH BIỂU DIỄN */}
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
                        Số khán giả dự kiến <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={expectedAudience}
                          onChange={(e) => setExpectedAudience(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="business-form-field">
                      <label className="business-form-label">
                        Giá vé dự kiến <span className="required-star">*</span>
                      </label>
                      <div className="business-input-wrapper">
                        <input
                          type="text"
                          placeholder="text input"
                          value={expectedTicketPrice}
                          onChange={(e) => setExpectedTicketPrice(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN 04: DANH SÁCH TÁC PHẨM BIỂU DIỄN */}
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