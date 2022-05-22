import { useEffect } from "react";
import { Route,Switch } from "react-router";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../redux/store';
import { BoardServ } from "../../service/board";
import store from '../../redux/store';


import List from "./list";
import View from "./view";



export default function Board():JSX.Element {
    const post = useSelector((store:RootState) => store.boardReducer.board);
    const board = new BoardServ();
    const dispatch:Dispatch = useDispatch()

    useEffect(() => {
        board.fetchBoard('get','/list')
        .then((response:any) => {
            dispatch({type: "setBoard",payload: response.data.reverse()});
        })
        .catch(err => {
            console.log(err);
        });
    },[post]);


    return (
        <>
            <Switch>
                <Route exact path='/'><List /></Route>
                <Route path='/view/:number'><View /></Route>
            </Switch>
        </>
    );
}
