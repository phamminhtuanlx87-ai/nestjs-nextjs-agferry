// Tên file: ProjectFormData.ts
export interface ProjectFormData {
    
    id: string;
    donViChuQuan: string;
    tenCongTrinh: string;
    donVi: string;
    ngayTao: string;
    trangThai: string;
    
    // Nhóm Dự toán
    dt_ID: string;
    dt_ngay: string;
    dt_TongGiaTri: string;
    dt_TongCPXD: string;
    dt_DonVi: string;
    dt_link: string;
    
    // Nhóm Thẩm tra
    tt_ID: string;
    tt_ngay: string;
    tt_TongGiaTri: string;
    tt_TongCPXD: string;
    tt_DonVi: string;
    tt_link: string;

    // Nhóm Qđ phê duyệt DT
    pd_ID: string;
    pd_ngay: string;
    pd_TongGiaTri: string;
    pd_TongCPXD: string;
    pd_DonVi: string;
    pd_link: string;


    // Nhóm Thi công
    tc_ID: string;
    tc_ngay: string;
    tc_tongNgay: string;
    tc_ngayHoanThanh: string;
    tc_DonVi: string;
    
    // Nhóm Nghiệm thu
    nt_ID: string;
    nt_ngay: string;
    nt_soNgayTcThucTe: string;
    nt_link: string;
    nt_DonVi: string;

    // Nhóm Dự toán PS
    dtdc_ID: string;
    dtdc_ngay: string;
    dtdc_TongGiaTri: string;
    dtdc_TongCPXD: string;
    dtdc_DonVi: string;
    dtdc_link: string;
    
    // Nhóm Thẩm tra DT PS
    ttdc_ID: string;
    ttdc_ngay: string;
    ttdc_TongGiaTri: string;
    ttdc_TongCPXD: string;
    ttdc_DonVi: string;
    ttdc_link: string;

    // Nhóm Qđ phê duyệt DT điều chỉnh
    pddc_ID: string;
    pddc_ngay: string;
    pddc_TongGiaTri: string;
    pddc_TongCPXD: string;
    pddc_DonVi: string;
    pddc_link: string;

   // Nhóm Quyết toán
    qt_ID: string;
    qt_ngay: string;
    qt_TongGiaTri: string;
    qt_TongCPXD: string;
    qt_DonVi: string;
    qt_link: string;
}