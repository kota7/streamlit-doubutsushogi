# -*- coding: utf-8 -*-

from logging import getLogger, basicConfig
logger = getLogger(__name__)
basicConfig(level=20)

def _parent_directory_to_path():
    import sys
    import os
    # add previous folder to the package path
    # so that it recognize ./doubutsushogi as the package
    p = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
    logger.info("Adding '%s' to the package path", p)
    sys.path.insert(0, p)
_parent_directory_to_path()

import streamlit as st
from doubutsushogi import evaluate_states, initial_state

from study import study_app
from play import play_app

def main():
    st.set_page_config(page_title="Doubutsu Shogi Master", layout="wide")

    with st.spinner("Setting up the database..."):
        # evaluate function automatically download the dbfile if not exists
        # this occurs only for the first time
        evaluate_states([initial_state()])
    
    with st.sidebar:
        piecename = st.selectbox("Piece type", ["emoji1", "emoji2", "emoji3", "hiragana"])
    
    tab1, tab2 = st.tabs(["Study", "Play"])
    with tab1:
        study_app(piecename=piecename)

    with tab2:
        play_app()

if __name__ == "__main__":
    main()