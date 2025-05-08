"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface AuthGuardProps {
  children: ReactNode;
}

const publicRoutes = ["/", "/unauthorized", "/register"];

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const accountString = localStorage.getItem("account");
    const account = accountString ? JSON.parse(accountString) : null;

    const isPublic = publicRoutes.includes(pathname);
    if (isPublic) {
      setChecked(true);
      return;
    }

    if (!token) {
      toast.error("Bạn không có quyền truy cập vào trang web");
      router.replace("/unauthorized");
      return;
    }

    if (account && account.isActive === false) {
      toast.error("Tài khoản của bạn đã bị vô hiệu hóa");
      router.replace("/unauthorized");
      return;
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) return null;

  return (
    <>
      {children}
    </>
  );
};

export default AuthGuard;
