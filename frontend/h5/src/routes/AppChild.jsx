import { Route, Routes } from "react-router-dom";
import ChildMainPage from "../pages/Child/ChildMainPage";
import ChildClassPage from "../pages/Child/ChildClassPage";
import ChildReviewPage from "../pages/Child/ChildReviewPage";
import ChildReviewGamePage from "../pages/Child/ChildReviewGamePage";
import ChildCardMainPage from "../pages/Child/ChildCard/ChildCardMainPage";
import ChildChatbotPage from "../pages/Child/ChildChatbotPage";
import ChildCardDetailsPage from "../pages/Child/ChildCard/ChildCardDetailsPage";
import NotFoundPage from "/src/pages/Error/NotFoundPage";

function AppChild() {
  return (
    <Routes>
      <Route path=":childId" element={<ChildMainPage />} />
      <Route path=":childId/todayclass" element={<ChildClassPage />} />
      <Route path=":childId/review" element={<ChildReviewPage />} />
      <Route
        path=":childId/review/:chapterId"
        element={<ChildReviewGamePage />}
      />
      <Route path=":childId/cardmain" element={<ChildCardMainPage />} />
      <Route
        path=":childId/cardmain/details/:emotionType"
        element={<ChildCardDetailsPage />}
      />
      <Route path=":childId/chatbot" element={<ChildChatbotPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppChild;
