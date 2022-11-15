# -*- coding: utf-8 -*-

from logging import getLogger, basicConfig
logger = getLogger(__name__)
basicConfig(level=10)

import streamlit as st
from doubutsushogi import evaluate_states, initial_state

from study import study_app
from play import play_app

_app_version = "0.0.8"  # this is the version number of the app, not the library

def _get_library_version(libname):
    # python 3.8+
    from importlib.metadata import version as _get_version
    return _get_version(libname)

try:
    _lib_version = _get_library_version("doubutsushogi")
    _component_version = _get_library_version("streamlit-doubutsushogi")
except:
    from doubutsushogi import __version__ as _lib_version
    from streamlit_douibutsushogi import __version__ as _component_version
logger.info("App ver '%s', lib ver '%s', component ver '%s'", _app_version, _lib_version, _component_version)

def main():
    st.set_page_config(page_title="Doubutsu Shogi Master", layout="wide", initial_sidebar_state="auto")

    with st.spinner("Setting up the database..."):
        # evaluate function automatically download the dbfile if not exists
        # this occurs only for the first time
        evaluate_states([initial_state()])
    
    with st.sidebar:
        piecename = st.selectbox("Piece type", ["emoji1", "emoji2", "emoji3", "hiragana"])
        st.markdown("---")

        st.markdown(f"""
        App Version {_app_version}
        / <a href="https://github.com/kota7/doubutsushogi-py" target="_blank" rel="noopener noreferrer">doubutsushogi {_lib_version}</a>
        / <a href="https://github.com/kota7/streamlit-doubutsushogi" target="_blank" rel="noopener noreferrer">streamlit-doubutsushogi {_component_version}</a>
        """, unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["Study", "Play"])
    with tab1:
        study_app(piecename=piecename)

    with tab2:
        play_app()

if __name__ == "__main__":
    main()
