# -*- coding: utf-8 -*-

import streamlit as st
from streamlit_doubutsushogi import st_doubutsushogi

c1, c2 = st.columns([6, 6])
with c1:
    state, status, action = st_doubutsushogi()

if status != 0:
    c2.write(f"Game over! Won by the player {status}")