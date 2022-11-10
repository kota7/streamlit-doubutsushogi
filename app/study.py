# -*- coding: utf-8 -*-

from logging import getLogger, basicConfig
logger = getLogger(__name__)

import pandas as pd
import streamlit as st
from streamlit_doubutsushogi import st_doubutsushogi
from doubutsushogi.evaluate import evaluate_states, remaining_steps, optimal_path


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
        message = f"State: `{state.text}`: **Value={value}** ({result})"
    else:
        message = f"State: `{state.text}`: Game over, won by Player{status}"

    st.markdown(message)

def _optimal_path_text(state, depth=6, randomize=True):
    p = optimal_path(state, depth=depth+1, randomize=randomize)
    out = "-".join(str(a) for a in p[:depth])
    if len(p) > depth:
        out += "..."
    return out

def _show_action_table(state):
    actions = state.valid_actions
    next_states = [state.action_result(a) for a in actions]
    next_states_text = [s.text for s in next_states]
    next_values = evaluate_states([s for s in next_states])
    
    paths = [_optimal_path_text(s, depth=8) for s in next_states]
    df = pd.DataFrame({
        "action": [str(a) for a in actions],
        "state": next_states_text,
        "value": next_values,
        "path": paths
    }).set_index("action").dropna().sort_values("value", ascending=(state.turn==2))
    st.dataframe(df)
        
def study_app(prefix="study", piecename="emoji1"):

    left, right = st.columns([5, 7])
    with left:
        state, status, action = st_doubutsushogi(piecename=piecename, cellsize="100px", piece_imgsize="90", prisoner_imgsize="60px")
        logger.info("Received value from the board UI: %s", (state, status, action))

            

    with right:
        _show_status_summary(state)
        _show_action_table(state)


