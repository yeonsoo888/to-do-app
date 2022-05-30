import { useState, useEffect, useRef } from "react";
import { useHistory, useParams } from "react-router";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../redux/store';
import { BoardServ } from "../../service/board";
import store from '../../redux/store';

export default function View() {
    const history = useHistory();
    const params:{number:string} = useParams();
    const currentNum = params.number.substring(1)
    const board = new BoardServ();
    const dispatch:Dispatch = useDispatch()

    const elInput = useRef(null) as React.RefObject<HTMLInputElement>;
    const elTextarea = useRef<HTMLTextAreaElement>(null);

    const post = useSelector((store:RootState) => store.boardReducer.board);
    
    const [selectPost,setSelectPost] = useState([])
    const [mode,setMode] = useState("view");


    useEffect( () => {
        const selectedPost = post.filter( (item:any) => {
            if(item._id == currentNum) {
                return item;
            }
        })
        setSelectPost([...selectedPost])
    },[post])

    const handleModify = () => {
        board.fetchBoard(
            'put',
            '/modify',
            {
                _id: parseInt(currentNum),
                title: elInput.current!.value,
                content: elTextarea.current!.value,
            }
        )
        .then(res => {
            const modifyPost = post.map((item:any) => {
                if(item._id === parseInt(currentNum)) {
                    item.title = elInput.current!.value;
                    item.content = elTextarea.current!.value;
                }
                return item;
            })
            dispatch({type:"setBoard", payload:modifyPost})
            setMode("view");
        });
    }
    
    const handleDelete = () => {
        if(window.confirm('삭제하시겠습니까?')) {
            board.fetchBoard(
                'delete',
                '/delete',
                {
                    _id: parseInt(currentNum)
                }
            )
            .then((res:any) => {
                const removeBoard = post.filter((item:any) => {
                    if(currentNum !== item._id) {
                        return item;
                    }
                });
                dispatch({type:'setBoard',payload:removeBoard});
                history.push('/');
            });
        }
    }

    
    
    return (
        <>
            <form>
                {
                    selectPost.map((item:any,i:number) => {
                        if(mode == "view") {
                            return(
                                <div key={i} className="view">
                                    <div className="statusWrap"><strong className="status">{item.status}</strong></div>
                                    <h4>{item.title}</h4>
                                    <p>{item.content}</p>
                                    <span>{item.date}</span>
                                </div>
                            )
                        } else {
                            return(
                                <div key={i} className="view">
                                    <div className="statusWrap"><strong className="">{item.status}</strong></div>
                                    <input type="text" defaultValue={item.title} ref={elInput} />
                                    <textarea name="" defaultValue={item.content} ref={elTextarea}></textarea>
                                    <span>{item.date}</span>
                                </div>
                            )
                        }
                    })
                }
                <div className="viewBtnWrap">
                    <button type="button" className="btnList" onClick={() => {
                        history.push('/');
                    }}>LIST</button>
                    {
                        mode == "view"
                        ? (
                            <>
                                <button type="button" onClick={() => {setMode("modify")}}>
                                    수정
                                </button>
                                <button type="button" onClick={handleDelete}>
                                    삭제
                                </button>
                            </>
                        )
                        : (
                            <>
                                <button type="button" onClick={() => {setMode("view")}}>
                                    취소
                                </button>
                                <button type="button" onClick={handleModify}>
                                    완료
                                </button>
                            </>
                        )
                    }
                    
                </div>
            </form>
        </>
    );
}
