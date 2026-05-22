import { useState, useMemo } from "react";
import { useCongTrinh } from "@/context/CongTrinhContext";

interface UseStageLockProps {
  targetIndex: number;
}

export function useStageLock({ targetIndex }: UseStageLockProps) {
  const data = useCongTrinh();
  const [isManuallyOpened, setIsManuallyOpened] = useState(false);

  // 🌟 Lấy số lượng giai đoạn hiện tại
  const currentStageCount = data?.giai_doan?.length || 0;

  // 🌟 Dùng useMemo để CHỈ tính toán lại khi currentStageCount hoặc isManuallyOpened thay đổi
  const lockStatus = useMemo(() => {
    const hasDataInDb = currentStageCount > targetIndex;
    const isDisabled = !hasDataInDb && !isManuallyOpened;

    return {
      isDisabled,
      showUnlockButton: isDisabled,
    };
  }, [currentStageCount, isManuallyOpened, targetIndex]); // Kén chọn dependency
  
  // Hàm xử lý mở khóa
  const unlockStage = () => {
    const hasDataInDb = currentStageCount > targetIndex;
    const isDisabled = !hasDataInDb && !isManuallyOpened;
    console.log(isDisabled);
    if (isDisabled) {
      setIsManuallyOpened(true);
    }
  };

  return {
    isDisabled: lockStatus.isDisabled,
    showUnlockButton: lockStatus.showUnlockButton,
    unlockStage,
  };
}
