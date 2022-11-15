# -*- coding: utf-8 -*-

from logging import getLogger, basicConfig
logger = getLogger(__name__)

import pandas as pd
import streamlit as st
from streamlit_doubutsushogi import st_doubutsushogi
from doubutsushogi.game import State
from doubutsushogi.evaluate import evaluate_states, remaining_steps, optimal_path, MAXVALUE

def _ns(name):
    return f"study-{name}"

def _show_status_summary(state):
    status = state.status
    if status == 0:
        value = evaluate_states([state])[0]
        if value is None:
            result = ""
        elif value == 0:
            result = "tie"
        else:
            winner = 1 if value > 0 else 2
            steps = remaining_steps(value)
            result = f"win by **{winner}** in **{steps}** steps"
        message = f"State: `{state.text}`, **Value={value}** ({result})"
    else:
        message = f"State: `{state.text}`, Game over, won by **Player {status}**"

    st.markdown(message)

def _optimal_path_text(state, depth=6, randomize=True):
    p = optimal_path(state, depth=depth+1, randomize=randomize)
    out = "-".join(str(a) for a in p[:depth])
    if len(p) > depth:
        out += "..."
    return out

def _show_action_table(state):
    if state.status != 0:
        # game is over, we will return an empty table
        df = pd.DataFrame({
            "action": [],
            "state": [],
            "value": [],
            "path": []
        }).set_index("action")
        st.dataframe(df)
    else:
        actions = state.valid_actions
        next_states = [state.action_result(a) for a in actions]
        next_states_text = [s.text for s in next_states]
        next_values = evaluate_states([s for s in next_states])
        statuses = [s.status for s in next_states] 
        next_values = [v if status == 0 else MAXVALUE if status == 1 else -MAXVALUE for v, status in zip(next_values, statuses)]

        paths = [_optimal_path_text(s, depth=8) for s in next_states]
        df = pd.DataFrame({
            "action": [str(a) for a in actions],
            "state": next_states_text,
            "value": next_values,
            "path": paths
        }).set_index("action").dropna().sort_values("value", ascending=(state.turn==2))
        df.value = df.value.astype(int)
        st.dataframe(df)

def _parse_state_text(state_text)-> State:
    try:
        s = State.from_text(state_text)
        return s
    except Exception as e:
        logger.warning("Invalid state text: '%s'", state_text)
    return None

def study_app(prefix="study", piecename="emoji1"):

    left, right = st.columns([5, 7])
    with right:
        state_text = st.text_input("Go to: ", placeholder="klz.h..H.ZLK0000001", disabled=True, help="This features is under development")

    with left:
        state, status, action = st_doubutsushogi(piecename=piecename, key=_ns("board"))
        logger.info("Received value from the board UI: %s", (state, status, action))

    with right:
        _show_status_summary(state)
        if state.status == 0:   # only show the table if the game is not over yet
            _show_action_table(state)