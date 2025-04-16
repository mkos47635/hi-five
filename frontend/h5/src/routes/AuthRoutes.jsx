import { Route, Routes } from "react-router-dom"
import IdSearch from "../pages/Auth/IdSearch"
import IdFind from "../pages/Auth/IdFind"
import PasswordSearch from "../pages/Auth/PasswordSearch"
import PasswordFind from "../pages/Auth/PasswordFind"
import PasswordChange from "../pages/Auth/PasswordChange"


function AuthRoutes(){
    return(
        <Routes>
            <Route path="/idsearch" element={<IdSearch />} />
            <Route path="/passwordsearch" element={<PasswordSearch />} />
            <Route path="/idfind/:name/:email" element={<IdFind />} />
            <Route path="/passwordfind" element={<PasswordFind />} />
            <Route path="/passwordchange" element={<PasswordChange />} />
        </Routes>
    
    )


}

export default AuthRoutes