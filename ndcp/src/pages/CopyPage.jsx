import { useState } from 'react'
import { cities, getWardsByCity } from '../data/vietnamLocations'

const copyTypes = [
  { id: 'movie', label: 'Phim điện ảnh' },
  { id: 'tvc', label: 'Quảng cáo TVC' },
  { id: 'album', label: 'Album biên tập' },
  { id: 'arcade', label: 'Máy chơi game Arcade' },
  { id: 'mv_audiovisual', label: 'Video ca nhạc và các tác phẩm nghe nhìn' },
]

function CopyPage() {
  // Ban đầu chưa chọn loại hình sao chép nào
  const [selectedType, setSelectedType] = useState('')

  // Form Thông tin đơn vị tổ chức / đăng ký
  const [orgName, setOrgName] = useState('')
  const [mst, setMst] = useState('')
  const [legalRep, setLegalRep] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+84')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [orgCity, setOrgCity] = useState('')
  const [orgWard, setOrgWard] = useState('')
  const [orgStreet, setOrgStreet] = useState('')

  // Danh sách tác phẩm sao chép
  const [works, setWorks] = useState([
    { id: 1, title: '', author: '', performer: '', link: '' },
    { id: 2, title: '', author: '', performer: '', link: '' },
  ])

  // Cam kết
  const [isAgreed, setIsAgreed] = useState(false)

  const handleAddWork = () => {
    setWorks([
      ...works,
      { id: Date.now(), title: '', author: '', performer: '', link: '' }
    ])
  }

  const handleDeleteWork = (id) => {
    if (works.length === 1) return
    setWorks(works.filter(w => w.id !== id))
  }

  const handleWorkChange = (id, field, value) => {
    setWorks(works.map(w => w.id === id ? { ...w, [field]: value } : w))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isAgreed) return
    alert('Đăng ký sao chép thành công!')
  }

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

        {/* CÁC PHẦN FORM CHỈ HỆN KHI NGƯỜI DÙNG ĐÃ CHỌN LOẠI HÌNH SAO CHÉP */}
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
                        Tên đơn vị đăng ký <span className="required-star">*</span>
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

                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN 03: DANH SÁCH TÁC PHẨM ĐĂNG KÝ SAO CHÉP */}
            <section className="register-panel-card">
              <div className="register-section">
                <div className="register-section-head" style={{ justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="register-step-number">03</span>
                    <h3>DANH SÁCH TÁC PHẨM ĐĂNG KÝ SAO CHÉP</h3>
                  </div>
                  <button
                    type="button"
                    className="karaoke-room-add-button"
                    onClick={handleAddWork}
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
                    {works.map((work, index) => (
                      <div
                        key={work.id}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, minmax(0, 1fr)) auto',
                          gap: '12px',
                          alignItems: 'end',
                          paddingBottom: index < works.length - 1 ? '16px' : '0',
                          borderBottom: index < works.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none'
                        }}
                      >
                        <div className="business-form-field">
                          <label className="business-form-label">Tên bài hát / Tác phẩm <span className="required-star">*</span></label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={work.title}
                              onChange={(e) => handleWorkChange(work.id, 'title', e.target.value)}
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
                              value={work.author}
                              onChange={(e) => handleWorkChange(work.id, 'author', e.target.value)}
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
                              value={work.performer}
                              onChange={(e) => handleWorkChange(work.id, 'performer', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="business-form-field">
                          <label className="business-form-label">Link bản ghi gốc <span className="required-star">*</span></label>
                          <div className="business-input-wrapper">
                            <input
                              type="text"
                              placeholder="text input"
                              value={work.link}
                              onChange={(e) => handleWorkChange(work.id, 'link', e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', height: '48px' }}>
                          <button
                            type="button"
                            className="karaoke-room-delete-button"
                            onClick={() => handleDeleteWork(work.id)}
                            disabled={works.length === 1}
                            style={{ opacity: works.length === 1 ? 0.4 : 1 }}
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

export default CopyPage