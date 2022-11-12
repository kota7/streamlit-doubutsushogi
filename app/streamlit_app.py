# -*- coding: utf-8 -*-

from logging import getLogger, basicConfig
logger = getLogger(__name__)
basicConfig(level=20)

import streamlit as st
from doubutsushogi import evaluate_states, initial_state

from study import study_app
from play import play_app

__version__ = "0.0.3"

def main():
    st.set_page_config(page_title="Doubutsu Shogi Master", layout="wide")

    with st.spinner("Setting up the database..."):
        # evaluate function automatically download the dbfile if not exists
        # this occurs only for the first time
        evaluate_states([initial_state()])
    
    with st.sidebar:
        piecename = st.selectbox("Piece type", ["emoji1", "emoji2", "emoji3", "hiragana"])
        st.markdown("---")
        st.markdown("""
        Version {} / 
        <a href="https://github.com/kota7/streamlit-doubutsushogi"  target="_blank" rel="noopener noreferrer">streamlit-doubutsushogi</a>
        """.format(__version__), unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["Study", "Play"])
    with tab1:
        study_app(piecename=piecename)

    with tab2:
        play_app()

if __name__ == "__main__":
    main()
