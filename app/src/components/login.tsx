import React, { ReactElement, useRef , useState } from "react";
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { Cookies } from "react-cookie";
import { Member } from '../service/auth';

type appProps = {
    setIsLogin : (a:Boolean) => void
}

function Login(props:appProps):JSX.Element {
    const dispatch:Dispatch = useDispatch()
    const inputMail = useRef<HTMLInputElement>(null);
    const inputPw = useRef<HTMLInputElement>(null);

    const [confirmId,setConfirmId] = useState<string | Boolean>(false);
    const member = new Member();
    const cookies = new Cookies();

    let mailValue:String;
    let pwValue:String;
    
    let now = new Date();
    let after1m = new Date();

    
    const handleLogin = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        after1m.setMinutes(now.getMinutes() + 60);
        if(inputMail.current !== null) {
            mailValue = inputMail.current.value;    
        }
        
        if(inputPw.current !== null) {
            pwValue = inputPw.current.value;
        }

        member.member('post','/login',{
            mail: mailValue,
            pw : pwValue,
        })
        .then((res:any) => {
            const token = res.data;
            cookies.set("user",token,{
                expires: after1m,
            });
            let userInfo:{userId:String,mail:String,level:String} = jwt_decode(token);
            dispatch({type: "loginMember",payload: {
                id: userInfo.userId,
                mail:userInfo.mail,
                level: userInfo.level,
            }});
            props.setIsLogin(true);
        })
        .catch((err:any) => {
            
        });
    }

    return (
        <>
            <div className="login">
                <h4 className="subTit">LOGIN</h4>
                <form onSubmit={handleLogin} >
                    <input type="text" placeholder="E-mail을 입력하세요" ref={inputMail} />
                    <input type="password" placeholder="비밀번호를 입력하세요" ref={inputPw} />
                    <button type="submit">로그인</button>
                    {
                        confirmId && <p>ID , PASSWORD를 확인해주세요</p>
                    }
                </form>
            </div>
        </>
    )
}

export default Login;
