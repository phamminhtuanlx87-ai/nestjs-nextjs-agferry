export const projectStatusMap: Record<
  string,
  { short: string; full: string; color: string }> = {
  "DT": {
    short: "Dự toán",
    full: "Lập dự toán công trình",
    color: "bg-amber-200 text-amber-900 border border-amber-400"
  },
  "TTR_DT": {
    short: "Thẩm tra DT",
    full: "Thẩm tra dự toán",
    color: "bg-blue-200 text-blue-900 border border-blue-400"
  },
  "PD_DT": {
    short: "Phê duyệt DT",
    full: "Phê duyệt dự toán & KH lựa chọn nhà thầu",
    color: "bg-blue-300 text-blue-900 border border-blue-400"
  },
  "TC": {
    short: "Thi công",
    full: "Công trình đang thi công",
    color: "bg-indigo-300 text-indigo-900 border border-indigo-400"
  },
  "NT": {
    short: "Nghiệm thu",
    full: "Nghiệm thu hoàn thành",
    color: "bg-emerald-300 text-emerald-900 border border-emerald-400"
  },
  "DT_PS": {
    short: "Dự Toán Phát Sinh",
    full: "Lập dự toán phát sinh (điều chỉnh)",
    color: "bg-amber-300 text-amber-900 border border-amber-400"
  },
  "TTR_DT_PS": {
    short: "Thẩm tra DT Phát Sinh",
    full: "Thẩm tra dự toán phát sinh (điều chỉnh)",
    color: "bg-blue-400 text-blue-900 border border-blue-400"
  },
  "PD_DT_PS": {
    short: "Phê duyệt DT Phát Sinh",
    full: "Phê duyệt dự toán phát sinh (điều chỉnh)",
    color: "bg-blue-300 text-blue-900 border border-blue-400"
  },
  "QT": {
    short: "Quyết toán",
    full: "Quyết toán hoàn thành công trình",
    color: "bg-emerald-100 text-emerald-700 border border-emerald-400"
  }
};