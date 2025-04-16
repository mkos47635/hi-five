import { Route, Routes } from "react-router-dom"
import CounselorChildrenPage from "../pages/Counselor/Children/CounselorChildrenPage"
import CounselorChildrenDataPage from "../pages/Counselor/Children/CounselorChildrenDataPage"
import CounselorSchedulePage from "../pages/Counselor/Schedule/CounselorSchedulePage"
import CounselorMyPage from "../pages/Counselor/Profile/CounselorMyPage"
import CounselorBoardPage from "../pages/Counselor/Board/CounselorBoardPage"
import CounselorBoardDetailPage from "../pages/Counselor/Board/CounselorBoardDetailPage"
import CounselorBoardNoticeWritePage from "../pages/Counselor/Board/CounselorBoardNoticeWritePage"
import CounselorBoardFaqWritePage from "../pages/Counselor/Board/CounselorBoardFaqWritePage"
// import CounselorParentVideoCall from "../pages/Counselor/Schedule/CounselorParentVideoCall"
import CounselorChildVideoCall from "../pages/Counselor/Schedule/CounselorChildVideoCall"
import CounselorParentVideoCallPage from "../pages/Counselor/Schedule/CounselorParentVideoCall";
import CounselorBoardEditPage from "../pages/Counselor/Board/CounselorBoardEditPage.jsx";
import NotFoundPage from "/src/pages/Error/NotFoundPage";
import CounselorVideoMultiplePage from "/src/pages/Counselor/Children/CounselorVideoMultiplePage"

function AppCounselor(){
    return(
        <Routes>
            <Route path="/children" element={<CounselorChildrenPage />} />
            <Route path="/children/data" element={<CounselorChildrenDataPage />} />
            <Route path="/schedule" element={<CounselorSchedulePage />} />
            <Route path="/schedule/parent-video-call" element={<CounselorParentVideoCallPage />} />
            <Route path="/schedule/child-video-call" element={<CounselorChildVideoCall />} />
            <Route path="/mypage" element={<CounselorMyPage />} />
            <Route path="/board" element={<CounselorBoardPage />} />
            <Route path="/board/:type/:no" element={<CounselorBoardDetailPage />} />
            <Route path="/board/notice/write" element={<CounselorBoardNoticeWritePage />} />
            <Route path="/board/faq/write" element={<CounselorBoardFaqWritePage />} />
            <Route path="/board/:type/edit/:no" element={<CounselorBoardEditPage />}/>
            <Route path="/child/video/multiple" element={<CounselorVideoMultiplePage />} />
            {/* <Route path="/video" element={<CounselorVideoPage />} />
            <Route path="/meeting" element={<CounselorMeetingPage />} />
             */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    
    )


}

export default AppCounselor