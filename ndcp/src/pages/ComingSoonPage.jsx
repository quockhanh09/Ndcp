import React from 'react'
import logo from '../assets/Appa-cmc-nen-toi.png'

const appaContact = {
  address: 'Tòa W1 - Vinhomes Westpoint - Phường Từ Liêm - Hà Nội',
  phone: '0989115323',
}

export default function ComingSoonPage() {
  return (
    <main className="page-shell">
      {/* HEADER: Chỉ giữ Logo và nút Về trang chủ, không có menu giữa */}
      <header className="app-header-bar" aria-label="Header điều hướng">
        <div className="app-brand" aria-label="Logo Appa CMC">
          <img src={logo} alt="Logo Appa CMC" className="app-brand-logo" />
        </div>

        <div style={{ flex: 1 }} />

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

      {/* BODY: Chữ Coming Soon nằm ở giữa */}
      <section style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '60px 20px',
        textAlign: 'center' 
      }}>
        <div style={{
          backgroundColor: 'rgba(15, 28, 48, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '60px 80px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold', letterSpacing: '2px', color: '#ffffff', margin: 0 }}>
            COMING SOON
          </h1>
          
        </div>
      </section>

      {/* FOOTER: Giữ nguyên thông tin chân trang cũ */}
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
            <span style={{ color: '#93c5fd', fontSize: '0.9rem', fontWeight: '600' }}>
              Điều khoản sử dụng
            </span>
          </div>

          <p className="app-footer-brand-1">Bản quyền dữ liệu thuộc về VK Entertainment JSC.</p>
        </div>
      </footer>
    </main>
  )
}