// import React, { useEffect } from 'react';
// import { Routes, Route } from 'react-router-dom'
// import { Home, Login, Rental, Homepage, DetailPost, SearchDetail } from './containers/Public'
// import { path } from './ultils/constant'
// import { CreatePost } from '../src/containers/System'
// import { System } from '../src/containers/System'
// import * as actions from './store/actions'
// import { useDispatch, useSelector } from 'react-redux'
// import Register from './containers/Public/Register'
// import Verify from './containers/Public/Verify'
// import PersonalInfo from './containers/System/PersonalInfo/PersonalInfo'
// import ChangePass from './containers/System/ChangePass'
// import ForgotPassword from './containers/Public/ForgotPass/ForgotPass'
// import ChatGPT from './components/Chat/ChatGPT'
// import ValidateCode from './containers/Public/ForgotPass/ValidateCode';
// import ResetPass from './containers/Public/ForgotPass/ResetPass';
// import ListPostsSaved from './containers/Public/ListPostsSaved';
// import UpgradeAccount from './containers/Public/UpgradeAccount';
// import HistoryPayment from './components/HistoryPayment';
// import DepositeHistory from './components/DepositeHistory';
// import Payment from './containers/System/Payment';
// import Momo from './components/Momo';
// import BankTransfer from './components/BankTransfer';
// import ManagePost from '../src/containers/System/ManagePost';


// function App() {

//   const dispatch = useDispatch()

//   const { isLoggedIn, token } = useSelector(state => state.auth)

//   useEffect(() => {
//     // Clear localStorage items related to authentication
//     localStorage.removeItem('persist:auth');
//     localStorage.removeItem('persist:root');

//     // Set a timeout to dispatch setUserInfo after 1 second
//     const timer = setTimeout(() => {
//       //const token = localStorage.getItem('token');
//       if (isLoggedIn && token) {
//         dispatch(actions.setUserInfo(token)); // Dispatch the action to update the Redux store
//       }
//     }, 1000); // 1 second timeout

//     // Cleanup the timer on component unmount or before re-running useEffect
//     return () => clearTimeout(timer);
//   }, [isLoggedIn, dispatch, token])

//   return (
//     <div className="bg-primary">
//       <Routes>

//         <Route path={path.LOGIN} element={<Login />} >

//           <Route path={path.FORGOT_PASS} element={<ForgotPassword />} >

//             <Route path={path.VALIDATE_CODE} element={<ValidateCode />} >

//               <Route path={path.RESET_PASS} element={<ResetPass />} />

//             </Route>

//           </Route>

//         </Route>



//         <Route path={path.REGISTER} element={<Register />} />

//         <Route path="register/verify" element={<Verify />} />

//         <Route path={path.HOME} element={<Home />}>

//           <Route path='*' element={<Homepage />} />




//           <Route path={path.CHO_THUE_CAN_HO} element={<Rental />} />

//           <Route path={path.CHO_THUE_MAT_BANG} element={<Rental />} />

//           <Route path={path.CHO_THUE_PHONG_TRO} element={<Rental />} />

//           <Route path={path.NHA_CHO_THUE} element={<Rental />} />

//           <Route path={path.SEARCH} element={<SearchDetail />} />

//           <Route path={path.DETAL_POST__TITLE__POSTID} element={<DetailPost />} />

//           <Route path={'chi-tiet/*'} element={<DetailPost />} />

//         </Route>


//         <Route path={path.SYSTEM} element={<System />} >

//           <Route path={path.MANAGE_POST} element={<ManagePost />} />

//           <Route path={path.CREATE_POST} element={<CreatePost />} />

//           <Route path={path.PERSONAL_INFO} element={<PersonalInfo />} />

//           <Route path={path.CHANGE_PASS} element={<ChangePass />} />

//           <Route path={path.UPGRADE_ACCOUNT} element={<UpgradeAccount />} />

//           <Route path={path.PAYMENT} element={<Payment />} >
//             <Route path={path.DEPOSITE_HISTORY} element={<DepositeHistory />} />
//             <Route path={path.HISTORY_PAYMENT} element={<HistoryPayment />} />
//             <Route path={path.MOMO} element={<Momo />} />
//             <Route path={path.BANK_TRANSFER} element={<BankTransfer />} />
//           </Route>
//         </Route>


//         <Route path={'tin-da-luu'} element={<ListPostsSaved />} />


//       </Routes>


//       <ChatGPT />

//     </div>

//   );
// }

// export default App;
// src/App.js

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home, Login, Rental, Homepage, DetailPost, SearchDetail } from './containers/Public';
import { path } from './ultils/constant';
import { CreatePost } from '../src/containers/System';
import { System } from '../src/containers/System';
import * as actions from './store/actions';
import { useDispatch, useSelector } from 'react-redux';
import Register from './containers/Public/Register';
import Verify from './containers/Public/Verify';
import PersonalInfo from './containers/System/PersonalInfo/PersonalInfo';
import ChangePass from './containers/System/ChangePass';
import ForgotPassword from './containers/Public/ForgotPass/ForgotPass';
import ChatGPT from './components/Chat/ChatGPT';
import ValidateCode from './containers/Public/ForgotPass/ValidateCode';
import ResetPass from './containers/Public/ForgotPass/ResetPass';
import ListPostsSaved from './containers/Public/ListPostsSaved';
import UpgradeAccount from './containers/Public/UpgradeAccount';
import HistoryPayment from './components/HistoryPayment';
import DepositeHistory from './components/DepositeHistory';
import Payment from './containers/System/Payment';
import Momo from './components/Momo';
import BankTransfer from './components/BankTransfer';
import ManagePost from '../src/containers/System/ManagePost';
import DeletedPosts from './containers/System/DeletedPosts';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, token } = useSelector(state => state.auth);

  useEffect(() => {
    // Clear localStorage items related to authentication
    localStorage.removeItem('persist:auth');
    localStorage.removeItem('persist:root');

    // Set a timeout to dispatch setUserInfo after 1 second
    const timer = setTimeout(() => {
      if (isLoggedIn && token) {
        dispatch(actions.setUserInfo(token)); // Dispatch the action to update the Redux store
      }
    }, 1); // 1 second timeout

    // Cleanup the timer on component unmount or before re-running useEffect
    return () => clearTimeout(timer);
  }, [isLoggedIn, dispatch, token]);

  return (
    <div className="bg-primary">
      {/* <AnimatePresence mode="wait" initial={false}> */}
      <Routes>
        {/* Trang chủ và các route con */}
        <Route path={path.HOME} element={<Home />}>
          <Route path="*" element={<Homepage />} />
          <Route path={path.CHO_THUE_CAN_HO} element={<Rental />} />
          <Route path={path.CHO_THUE_MAT_BANG} element={<Rental />} />
          <Route path={path.CHO_THUE_PHONG_TRO} element={<Rental />} />
          <Route path={path.NHA_CHO_THUE} element={<Rental />} />
          <Route path={path.SEARCH} element={<SearchDetail />} />
          <Route path={path.DETAL_POST__TITLE__POSTID} element={<DetailPost />} />
          <Route path="chi-tiet/*" element={<DetailPost />} />
        </Route>

        {/* Các route đăng nhập và đăng ký */}
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.FORGOT_PASS} element={<ForgotPassword />} />
        <Route path={path.VALIDATE_CODE} element={<ValidateCode />} />
        <Route path={path.RESET_PASS} element={<ResetPass />} />
        <Route path={path.REGISTER} element={<Register />} />
        <Route path="register/verify" element={<Verify />} />

        {/* Các route công khai khác */}
        <Route path="tin-da-luu" element={<ListPostsSaved />} />

        {/* System Routes */}
        <Route path={path.SYSTEM} element={<System />} >
          <Route path={path.MANAGE_POST} element={<ManagePost />} />
          <Route path="quan-ly-bai-dang/tin-da-xoa" element={<DeletedPosts />} />
          <Route path={path.CREATE_POST} element={<CreatePost />} />
          <Route path={path.PERSONAL_INFO} element={<PersonalInfo />} />
          <Route path={path.CHANGE_PASS} element={<ChangePass />} />
          <Route path={path.UPGRADE_ACCOUNT} element={<UpgradeAccount />} />
          <Route path={path.PAYMENT} element={<Payment />} >
            <Route path={path.DEPOSITE_HISTORY} element={<DepositeHistory />} />
            <Route path={path.HISTORY_PAYMENT} element={<HistoryPayment />} />
            <Route path={path.MOMO} element={<Momo />} />
            <Route path={path.BANK_TRANSFER} element={<BankTransfer />} />
          </Route>
        </Route>
      </Routes>

      {/* ChatGPT Component */}
      <ChatGPT />
    </div>
  );
}

export default App;