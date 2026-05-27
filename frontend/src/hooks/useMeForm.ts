/* eslint-disable react-hooks/incompatible-library */
import { useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getMe, meUpdate, MeData, MeFormValues, MeRequest } from "@/services/authService";
import { alertService } from "@/utils/swal";
import { DEPARTMENTS, POSITIONS, MAP_DEPARTMENT_POSITIONS, getLabelByValue } from "@/utils/userHelpers";

export function useMeForm() {
  const router = useRouter();
  const [meData, setMeData] = useState<MeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<MeFormValues>({
    defaultValues: { fullName: "", userName: "", email: "", department: "CXD", positions: "CXD" },
  });

  const watchedFullName = watch("fullName") || "";
  const watchedDepartment = watch("department") || "CXD";
  const watchedPositions = watch("positions") || "CXD";
  const watchedEmail = watch("email") || "";

  // 1. Gọi API lấy dữ liệu duy nhất 1 lần khi mount (Đã sửa lỗi 429)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await getMe();
        if (data) {
          reset({
            fullName: data.fullName || "",
            userName: data.userName || "",
            email: data.email || "",
            department: data.department?.id || "CXD",
            positions: data.positions?.id || "CXD",
            isActive: data.isActive,
          });
          setMeData(data);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu tài khoản:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  // 2. Tự động cập nhật danh sách Chức vụ khả dụng theo Phòng ban
  const availablePositions = useMemo(() => {
    if (!watchedDepartment) return [];
    const allowedCodes = MAP_DEPARTMENT_POSITIONS[watchedDepartment] || [];
    return POSITIONS.filter((pos) => allowedCodes.includes(pos.value));
  }, [watchedDepartment]);

  useEffect(() => {
    if (watchedDepartment) {
      const allowedCodes = MAP_DEPARTMENT_POSITIONS[watchedDepartment] || [];
      if (watchedPositions && !allowedCodes.includes(watchedPositions)) {
        setValue("positions", allowedCodes[allowedCodes.length - 1] || "");
      }
    }
  }, [watchedDepartment, watchedPositions, setValue]);

  // 3. Quản lý đếm ngược Cooldown (Đã làm sạch, không cần setInterval thừa ở onSubmit nữa)
  useEffect(() => {
    if (cooldownTime <= 0) return;
    const interval = setInterval(() => {
      setCooldownTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownTime]);

  // 4. Xử lý Submit Form
  const onSubmit = async (data: MeFormValues) => {
    try {
      setIsSubmitting(true);
      const payload: MeRequest = {
        fullName: data.fullName,
        email: data.email,
        department: { id: data.department, name: getLabelByValue(DEPARTMENTS, data.department) },
        positions: { id: data.positions, name: getLabelByValue(POSITIONS, data.positions) },
      };

      const response = await meUpdate(payload);
      if (response) {
        alertService.success("Cập nhật thông tin thành công!");
        router.refresh();
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu cấu hình:", error);
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        alertService.error("Hệ thống phát hiện hành vi spam liên tục! Nút gửi sẽ khóa trong 5 phút.");
        setCooldownTime(300); // Chỉ cần set state, useEffect số 3 bên trên sẽ tự động đếm ngược
      } else {
        alertService.error("Có lỗi xảy ra khi cập nhật thông tin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register, handleSubmit, onSubmit, errors, isLoading, isSubmitting, cooldownTime, meData,
    watchedFullName, watchedEmail, availablePositions,
    currentDeptLabel: getLabelByValue(DEPARTMENTS, watchedDepartment),
    currentPositionLabel: getLabelByValue(POSITIONS, watchedPositions),
  };
}