export const urbanClasses = [
  { id: 'special', label: 'Đô thị đặc biệt', multiplier: 1.0 },
  { id: 'grade1', label: 'Đô thị loại I', multiplier: 0.8 },
  { id: 'grade2', label: 'Đô thị loại II', multiplier: 0.5 },
  { id: 'grade3', label: 'Đô thị loại III', multiplier: 0.2 },
  { id: 'industrial', label: 'Khu Công nghiệp / KKT đặc biệt', multiplier: 0.1 },
  { id: 'rural', label: 'Nông thôn / Vùng sâu / Miền núi', multiplier: 0.1 },
]

export const cities = [
  { id: 'hanoi', name: 'Hà Nội', urbanClassId: 'special' },
  { id: 'hcmc', name: 'TP. Hồ Chí Minh', urbanClassId: 'special' },
  { id: 'danang', name: 'Đà Nẵng', urbanClassId: 'grade1' },
  { id: 'haiphong', name: 'Hải Phòng', urbanClassId: 'grade1' },
  { id: 'cantho', name: 'Cần Thơ', urbanClassId: 'grade1' },
  { id: 'hue', name: 'Huế', urbanClassId: 'grade2' },
  { id: 'nhatrang', name: 'Nha Trang', urbanClassId: 'grade2' },
  { id: 'bienhoa', name: 'Biên Hòa', urbanClassId: 'grade2' },
  { id: 'vungtau', name: 'Vũng Tàu', urbanClassId: 'grade2' },
  { id: 'thaibinh', name: 'Thái Bình', urbanClassId: 'grade3' },
  { id: 'thanhhoa', name: 'Thanh Hóa', urbanClassId: 'grade3' },
  { id: 'vinh', name: 'Vinh', urbanClassId: 'grade3' },
  { id: 'quangninh', name: 'Quảng Ninh', urbanClassId: 'grade3' },
]

export const wards = [
  { id: 'hn_01', name: 'Ba Đình', cityId: 'hanoi' },
  { id: 'hn_02', name: 'Hoàn Kiếm', cityId: 'hanoi' },
  { id: 'hn_03', name: 'Tây Hồ', cityId: 'hanoi' },
  { id: 'hn_04', name: 'Long Biên', cityId: 'hanoi' },
  { id: 'hn_05', name: 'Cầu Giấy', cityId: 'hanoi' },
  { id: 'hn_06', name: 'Đống Đa', cityId: 'hanoi' },
  { id: 'hn_07', name: 'Hai Bà Trưng', cityId: 'hanoi' },
  { id: 'hn_08', name: 'Hoàng Mai', cityId: 'hanoi' },
  { id: 'hn_09', name: 'Thanh Xuân', cityId: 'hanoi' },
  { id: 'hn_10', name: 'Sóc Sơn', cityId: 'hanoi' },
  { id: 'hcmc_01', name: 'Quận 1', cityId: 'hcmc' },
  { id: 'hcmc_02', name: 'Quận 3', cityId: 'hcmc' },
  { id: 'hcmc_03', name: 'Quận 5', cityId: 'hcmc' },
  { id: 'hcmc_04', name: 'Quận 7', cityId: 'hcmc' },
  { id: 'hcmc_05', name: 'Bình Thạnh', cityId: 'hcmc' },
  { id: 'hcmc_06', name: 'Phú Nhuận', cityId: 'hcmc' },
  { id: 'hcmc_07', name: 'Tân Bình', cityId: 'hcmc' },
  { id: 'hcmc_08', name: 'Gò Vấp', cityId: 'hcmc' },
  { id: 'dn_01', name: 'Hải Châu', cityId: 'danang' },
  { id: 'dn_02', name: 'Thanh Khê', cityId: 'danang' },
  { id: 'dn_03', name: 'Sơn Trà', cityId: 'danang' },
  { id: 'dn_04', name: 'Ngũ Hành Sơn', cityId: 'danang' },
  { id: 'dn_05', name: 'Liên Chiểu', cityId: 'danang' },
  { id: 'hp_01', name: 'Ngô Quyền', cityId: 'haiphong' },
  { id: 'hp_02', name: 'Lê Chân', cityId: 'haiphong' },
  { id: 'hp_03', name: 'Kiến An', cityId: 'haiphong' },
  { id: 'hp_04', name: 'Hồng Bàng', cityId: 'haiphong' },
  { id: 'ct_01', name: 'Ninh Kiều', cityId: 'cantho' },
  { id: 'ct_02', name: 'Bình Thủy', cityId: 'cantho' },
  { id: 'ct_03', name: 'Cái Răng', cityId: 'cantho' },
  { id: 'hue_01', name: 'Huế', cityId: 'hue' },
  { id: 'hue_02', name: 'Hương Thủy', cityId: 'hue' },
  { id: 'nt_01', name: 'Nha Trang', cityId: 'nhatrang' },
  { id: 'nt_02', name: 'Cam Ranh', cityId: 'nhatrang' },
  { id: 'bh_01', name: 'Biên Hòa', cityId: 'bienhoa' },
  { id: 'bh_02', name: 'Long Khánh', cityId: 'bienhoa' },
  { id: 'vt_01', name: 'Vũng Tàu', cityId: 'vungtau' },
  { id: 'vt_02', name: 'Bà Rịa', cityId: 'vungtau' },
  { id: 'tb_01', name: 'Thái Bình', cityId: 'thaibinh' },
  { id: 'th_01', name: 'Thanh Hóa', cityId: 'thanhhoa' },
  { id: 'th_02', name: 'Sầm Sơn', cityId: 'thanhhoa' },
  { id: 'vh_01', name: 'Vinh', cityId: 'vinh' },
  { id: 'qn_01', name: 'Hạ Long', cityId: 'quangninh' },
  { id: 'qn_02', name: 'Cẩm Phả', cityId: 'quangninh' },
]

export function getWardsByCity(cityId) {
  return wards.filter((ward) => ward.cityId === cityId)
}

export function getUrbanClassById(urbanClassId) {
  return urbanClasses.find((uc) => uc.id === urbanClassId) ?? urbanClasses[urbanClasses.length - 1]
}

export function getActiveRegion(cityId, wardId) {
  const city = cities.find((c) => c.id === cityId)
  if (!city) {
    return getUrbanClassById('rural')
  }

  const ward = wards.find((w) => w.id === wardId && w.cityId === cityId)
  if (ward) {
    return getUrbanClassById(city.urbanClassId)
  }

  return getUrbanClassById(city.urbanClassId)
}

export function getActiveRegionLabel(cityId, wardId) {
  const region = getActiveRegion(cityId, wardId)
  return region ? region.label : ''
}
