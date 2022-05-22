import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import store from '../../redux/store';
import { RootState } from '../../redux/store';
import { BoardServ } from "../../service/board";

export default function List():JSX.Element {
    const post = useSelector((store:RootState) => store.boardReducer.board);
    const board = new BoardServ();
    const dispatch:Dispatch = useDispatch()

    const elInput = useRef<HTMLInputElement>(null);
    const elTextarea = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        board.fetchBoard('get','/list')
        .then((response:any) => {
            dispatch({type: "setBoard",payload: response.data.reverse()});
        })
        .catch(err => {
            console.log(err);
        });
    },[])

    const handleDone = (number:Number) => {
        board.fetchBoard('put','/done',{
            _id: number,
        })
        .then((response:any) => {
            let newPosts = post.filter((item:any) => {
                if(item._id == number) {
                    item.status = "done";
                }
                return item;
            });
            
            dispatch({type: "setBoard",payload: newPosts});
        })
        .catch(err => {
            console.log(err);
        });
    }

    const handleDoing = (number:Number) => {
        board.fetchBoard('put','/doing',{
            _id: number,
        })
        .then((response:any) => {
            let newPosts = post.filter((item:any) => {
                if(item._id == number) {
                    item.status = "doing";
                }
                return item;
            });
            
            dispatch({type: "setBoard",payload: newPosts});
            dispatch({type: "setBoard",payload: response.data.reverse()});
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <>
            <ul className="board__list">
                {
                    post.map((item:any) => {
                        let key:React.Key = item._id;
                        return (
                            <li key={key} className={item.status}>
                                <Link to={`/view/:${item._id}`}>
                                    <div className="txtWrap">
                                        <b className="title">{item.title}</b>
                                        <p className="contents">{item.content}</p>
                                        <p className="date">{item.date}</p>
                                    </div>
                                </Link>
                                <div className="btnWrap">
                                    {
                                        item.status == "done"
                                        ? <button onClick={() => {handleDoing(item._id)}}>DOING</button>
                                        : <button onClick={() => {handleDone(item._id)}}>DONE</button>
                                    }
                                    
                                    <button>DELETE</button>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="write__Area">
                <form>
                    <input type="text" name="title" placeholder="제목" ref={elInput} />
                    <textarea name="content" placeholder="할일" ref={elTextarea}></textarea>
                </form>
            </div>
        </>
    )
}
