import { useEffect, useState } from "react"
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
    
    useEffect(() => {
        board.fetchBoard('get','/list')
        .then((response:any) => {
            console.log(response);
            dispatch({type: "setBoard",payload: response.data.reverse()});
        })
        .catch(err => {
            console.log(err);
        });
    },[])

    const handleDone = (number:Number) => {
        board.fetchBoard('put','/done')
            .then((response:any) => {
                console.log(response);
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
                            <li key={key}>
                                <Link to={`/view/:${item._id}`}>
                                    <div className="txtWrap">
                                        <b className="title">{item.title}</b>
                                        <p className="contents">{item.content}</p>
                                        <p className="date">{item.date}</p>
                                    </div>
                                </Link>
                                <div className="btnWrap">
                                    <button onClick={() => {handleDone(item._id)}}>DONE</button>
                                    <button>DELETE</button>
                                </div>
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}
