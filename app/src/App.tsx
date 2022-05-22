import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import store from './redux/store';
import { RootState } from './redux/store';

import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import Login from './components/login';
import Board from './components/board/board';

import './css/style.scss';
import { useHistory } from 'react-router';
function App():JSX.Element {
  const history = useHistory()
  const dispatch:Dispatch = useDispatch()
  const cookies = new Cookies();
  const [isLogin,setIsLogin]:any[] = useState(false);



  useEffect(() => {
    const userCookies:any = cookies.get("user")
    if(userCookies !== undefined) {
      let userInfo:{userId:String,mail:String,level:String} = jwt_decode(userCookies);
      dispatch({type: "loginMember",payload: {
          id: userInfo.userId,
          mail:userInfo.mail,
          level: userInfo.level,
      }});
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  },[])

  const authLogout = ():void => {
    setIsLogin(false);
    cookies.remove("user");
    history.push('/');
  }

  return (
    <>
      <h1 className="TODOAPP__TIT">YS TODO APP</h1>
      {
        isLogin && (
          <div className='btnLogoutWrap'>
            <button onClick={authLogout}>로그아웃</button>
          </div>
        )
      }
      
      {
        !isLogin
        ? <Login setIsLogin={setIsLogin} />
        : (
          <>
            <Board />
            
          </>
        )
      }      
    </>
  );
}

export default App;
