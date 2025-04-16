import { Route, Routes } from "react-router-dom"
import ParentChildPage from "/src/pages/Parent/Child/ParentChildPage"
import ParentSchedulePage from "/src/pages/Parent/Schedule/ParentSchedulePage"
import ParentBoardPage from "/src/pages/Parent/Board/ParentBoardPage"
import ParentMyPage from "/src/pages/Parent/My/ParentMyPage"
import ParentBoardDetailPage from "/src/pages/Parent/Board/ParentBoardDetailPage"
import ParentBoardWritePage from "/src/pages/Parent/Board/ParentBoardWritePage"
import ParentVideoSinglePage from "/src/pages/Parent/Child/ParentViedoSinglePage"
import ParentVideoMultiplePage from "/src/pages/Parent/Child/ParentVideoMultiplePage"
// import ParentVideoCallPage from "/src/pages/Parent/Schedule/ParentVideoCallPage"
import ParentBoardEditPage from "../pages/Parent/Board/ParentBoardEditPage.jsx";
import CounselorParentVideoCallPage from "../pages/Counselor/Schedule/CounselorParentVideoCall.jsx";
import NotFoundPage from "/src/pages/Error/NotFoundPage";


function AppParent(){
    return(
        <Routes>
            {/* 헤더에서 이동가능한 페이지 */}
            <Route path="/data" element={<ParentChildPage />} />
            <Route path="/schedule" element={<ParentSchedulePage />} />
            <Route path="/board" element={<ParentBoardPage />} />
            <Route path="/my" element={<ParentMyPage />} />

            {/* ParertChild에서 이동가능한 페이지지 */}
            <Route path="/child/video/single" element={<ParentVideoSinglePage />} />
            <Route path="/child/video/multiple" element={<ParentVideoMultiplePage />} />

            {/* ParertSchedult에서 이동가능한 페이지지 */}
            <Route path="/schedule/call" element={<CounselorParentVideoCallPage />} />

            {/* BoardPage에서 이동가능한 페이지지 */}
            <Route path="/board/:type/:no" element={<ParentBoardDetailPage />} />
            <Route path="/board/:type/edit/:no" element={<ParentBoardEditPage />} />
            <Route path="/board/write" element={<ParentBoardWritePage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    
    )


}

export default AppParent