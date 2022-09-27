import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";
import { useRouter } from 'next/router'

export default function (SpecificComponent, option, adminRoute = null) {
  //option : null = anyone, true = login user only, false = logout user only
  function AuthenticationCheck(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
      dispatch(auth())
          .then(response => {
              console.log(response)
              if (!response.payload.isAuth) {
                  //로그인 하지 않은 상태 
                  if (option === true) {
                    router.push('/LoginPage')
                      alert("need login.")
                  }
              } else {
                  //로그인 한 상태
                  if (adminRoute && !response.payload.isAdmin) {
                    router.push('/')
                      alert("권한이 없습니다.")
                  } else {
                      if(option === false){
                        router.push('/')
                          alert("이미 로그인 하였습니다.")
                      }
                  }

              }


          })
  }, [])



    /*useEffect(() => {
      dispatch(auth()).then((response) => {
        console.log("auth? ", response);

        if (!response.payload.isAuth) {
          // login yet
          if (option) {
            navigate("/login");
          }
        } else {
          // login
          if (adminRoute && !response.payload.isAdmin) {
            navigate("/");
          } else {
            if (option === false) {
              navigate("/");
            }
          }
        }
      });
    }, [/*dispatch, navigate*/;

    return (
      <SpecificComponent /> // component return이 없으면 React 실행이 안됨.
    );
  }

  return <AuthenticationCheck />;
}