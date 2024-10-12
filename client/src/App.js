import { Routes, Route } from 'react-router-dom'
import { Home, Login, Rental, Homepage, DetailPost, SearchDetail } from './containers/Public'
import { path } from './ultils/constant'
import { System, CreatePost } from './containers/System'
import * as actions from './store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Register from './containers/Public/Register'
import Verify from './containers/Public/Verify'
import PersonalInfo from './components/PersonalInfo/PersonalInfo'
import ChangePass from './components/ChangePass/ChangePass'
import Payment from './containers/System/Payment'
import Chat from './components/Chat/Chat'
import HistoryPayment from './components/HistoryPayment'
import DepositHistory from './components/DepositHistory'
import Momo from './components/Momo'

function App() {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(state => state.auth)
  useEffect(() => {

    // Clear localStorage items related to authentication
    localStorage.removeItem('persist:auth');
    localStorage.removeItem('token');
    localStorage.removeItem('persist:root');

    setTimeout(() => {
      isLoggedIn && dispatch(actions.getCurrent())
    }, 1000)
  }, [isLoggedIn])

  useEffect(() => {
    dispatch(actions.getPrices())
    dispatch(actions.getAreas())
    dispatch(actions.getProvinces())
  }, [])

  return (

    <div className="bg-primary">
      <Routes>
        <Route path={path.HOME} element={<Home />}>
          <Route path='*' element={<Homepage />} />
          <Route path={path.LOGIN} element={<Login />} />
          <Route path={path.REGISTER} element={<Register />} />
          <Route path="register/verify" element={<Verify />} />
          <Route path={path.CHO_THUE_CAN_HO} element={<Rental />} />
          <Route path={path.CHO_THUE_MAT_BANG} element={<Rental />} />
          <Route path={path.CHO_THUE_PHONG_TRO} element={<Rental />} />
          <Route path={path.NHA_CHO_THUE} element={<Rental />} />
          <Route path={path.SEARCH} element={<SearchDetail />} />
          <Route path={path.DETAL_POST__TITLE__POSTID} element={<DetailPost />} />
          <Route path={'chi-tiet/*'} element={<DetailPost />} />
        </Route>
        <Route path={path.SYSTEM} element={<System />} >
          <Route path={path.CREATE_POST} element={<CreatePost />} />
          <Route path={path.PERSONAL_INFO} element={<PersonalInfo />} />
          <Route path={path.PAYMENT} element={<Payment/>} />
          <Route path={path.CHANGE_PASS} element={<ChangePass />} />
        </Route>
        <Route path="/he-thong/lich-su-nap-tien" element={<HistoryPayment />}/>
        <Route path="/he-thong/lich-su-thanh-toan" element={<DepositHistory/>}/>
        <Route path={path.MOMO} element={<Momo/>}/>
      </Routes>
      <Chat/>
    </div>
  );
}

export default App;
