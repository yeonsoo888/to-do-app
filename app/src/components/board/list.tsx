import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../redux/store';
import { BoardServ } from "../../service/board";
import store from '../../redux/store';

export default function List():JSX.Element {
    const post = useSelector((store:RootState) => store.boardReducer.board);
    const auth:{mail?:string} = useSelector((store:RootState) => store.memberReducer.member);
    
    const board = new BoardServ();
    const today:Date = new Date();
    const dispatch:Dispatch = useDispatch()

    const elInput = useRef(null) as React.RefObject<HTMLInputElement>;
    const elTextarea = useRef<HTMLTextAreaElement>(null);
    const writerInput = useRef(null) as React.RefObject<HTMLInputElement>;

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("ok");
        board.fetchBoard(
            'post',
            '/add',
            {
                title: elInput.current!.value,
                content: elTextarea.current!.value,
                date: today.toLocaleDateString(),
                writer : writerInput.current!.value,
                status: "doing",
            }
        )
        .then((res:any) => {
            const newPost = [
                {
                    _id : res.data._id,
                    title: elInput.current!.value,
                    content: elTextarea.current!.value,
                    date: today.toLocaleDateString(),
                    writer : writerInput.current!.value,
                    status: "doing"
                },
                ...post,
            ];
            dispatch({type:"setBoard", payload:newPost})
        });
    }

    const handleDelete = (number:Number) => {
        board.fetchBoard(
            'delete',
            '/delete',
            {
                _id: number
            }
        )
        .then((res:any) => {
            const removeBoard = post.filter((item:any) => {
                if(number !== item._id) {
                    return item;
                }
            });
            dispatch({type:'setBoard',payload:removeBoard});
        });
    }

    return (
        <>
            <ul className="board__list" >
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
                                        ? <button onClick={() => {handleDoing(item._id)}}>DONE</button>
                                        : <button onClick={() => {handleDone(item._id)}}>DOING</button>
                                    }
                                    <button onClick={() => {handleDelete(item._id)}}>DELETE</button>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
            <div className="write__Area">
                <form onSubmit={(e) => {handleSubmit(e);}}>
                <input type="hidden" name="writer" value={auth.mail} hidden ref={writerInput} />
                    <div className="write__Inner">
                        <input type="text" name="title" placeholder="할 일" ref={elInput} />
                        <textarea name="content" placeholder="설명" ref={elTextarea}></textarea>
                        <button>Add List</button>
                    </div>
                </form>
            </div>
        </>
    )
}
