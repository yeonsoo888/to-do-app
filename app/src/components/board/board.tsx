import { useEffect } from "react";

import { Route,Switch } from "react-router";
import { Link } from "react-router-dom";

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux'
import { Dispatch } from 'redux'
import store from '../../redux/store';
import { RootState } from '../../redux/store';

import { BoardServ } from "../../service/board";

import List from "./list";

export default function Board():JSX.Element {
    const auth = useSelector((store:RootState) => store.memberReducer.member)
    



    return (
        <>
            <Switch>
                <Route exact path='/'><List /></Route>
                <Route exact path='/view/:number'></Route>
            </Switch>
        </>
    );
}
