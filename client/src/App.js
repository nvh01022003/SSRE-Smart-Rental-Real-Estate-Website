import React from 'react';
import { Routes, Route } from 'react-router-dom'
import { Home, Login, Rental, Homepage, DetailPost, SearchDetail } from './containers/Public'
import { path } from './ultils/constant'
import { CreatePost } from '../src/containers/System'
import { System } from '../src/containers/System'
import * as actions from './store/actions'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import Register from './containers/Public/Register'
import Verify from './containers/Public/Verify'
import PersonalInfo from './containers/System/PersonalInfo/PersonalInfo'
import ChangePass from './containers/System/ChangePass'
import ForgotPassword from './containers/Public/ForgotPass/ForgotPass'
import ChatGPT from './components/Chat/ChatGPT'
import ValidateCode from './containers/Public/ForgotPass/ValidateCode';
import ResetPass from './containers/Public/ForgotPass/ResetPass';
import ListPostsSaved from './containers/Public/ListPostsSaved';

//import Item from './components/Item';

function App() {
  const dispatch = useDispatch()
  const { isLoggedIn } = useSelector(state => state.auth)
  useEffect(() => {

    // Clear localStorage items related to authentication
    localStorage.removeItem('persist:auth');

    localStorage.removeItem('persist:root');


    // setTimeout(() => {
    //   isLoggedIn && dispatch(actions.getCurrent())
    // }, 1000)
  }, [isLoggedIn, dispatch])

  // useEffect(() => {
  //   dispatch(actions.getPrices())
  //   dispatch(actions.getAreas())
  //   dispatch(actions.getProvinces())
  // }, [dispatch])

  return (

    <div className="bg-primary">
      <Routes>
        <Route path={path.HOME} element={<Home />}>
          <Route path='*' element={<Homepage />} />

          <Route path={path.LOGIN} element={<Login />} >
            <Route path={path.FORGOT_PASS} element={<ForgotPassword />} >
              <Route path={path.VALIDATE_CODE} element={<ValidateCode />} >
                <Route path={path.RESET_PASS} element={<ResetPass />} />
              </Route>
            </Route>
          </Route>



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
          <Route path={path.CHANGE_PASS} element={<ChangePass />} />
        </Route>

        <Route path={'tin-da-luu'} element={<ListPostsSaved />} />
        {/* <Route path={path.HOME_ADMIN} element={<HomeAdmin />} >

        </Route> */}
      </Routes>
      <ChatGPT />

    </div>


    // <div>
    //   <Item />
    // </div>
  );
}

export default App;
