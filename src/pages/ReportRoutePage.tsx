import { useAuth } from "@/context/AuthContext"


import ReportAdminPage from "@/pages/ReportAdminPage.tsx";
import ReportPage from "@/pages/ReportPage.tsx";


const ReportRoutePage = () => {
  const {user} = useAuth();

  return (

    <>
      {user?.role==='admin' ? <ReportAdminPage/> : <ReportPage/>}
    </>

  )
}

export default ReportRoutePage