import React, { useEffect, useState } from "react";
import { Skeleton } from "antd";

const SettingsSkeleton = ({ children, currentStep }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => setLoading(false), 800);

    return () => {
      clearTimeout(timer);
    };
  }, [currentStep]);

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;

  return children;
};

export default SettingsSkeleton;
