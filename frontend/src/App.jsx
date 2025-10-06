import { BrowserRouter, Routes, Route } from 'react-router';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProfilePage from './features/profile/pages/ProfilePage'
import PackagePage from './features/package/pages/PackagePage'
function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/header" element={<Header />} />
                    <Route path="/footer" element={<Footer />} />
                    <Route path='/profile' element={<ProfilePage/>}/>
                    <Route path='/packages' element={<PackagePage/>}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App
