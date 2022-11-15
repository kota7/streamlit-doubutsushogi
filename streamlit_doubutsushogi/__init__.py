# -*- coding: utf-8 -*-

import os
from collections import namedtuple
from logging import getLogger
import streamlit.components.v1 as components
from doubutsushogi.game import State, Action, PRISONER_INDEX
logger = getLogger(__name__)

__version__ = "0.0.13"

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = True

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("my_component"
        # does not fit this bill, so please choose something better for your
        # own component :)
        "st_doubutsushogi",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("st_doubutsushogi", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def st_doubutsushogi(state=None, action=None, piecename="emoji1", ui_width=None, key=None):
    #, ui_width=None, cellsize="100px", piece_imgsize="90", prisoner_imgsize="60px"
    """
    Create a new instance of st_doubutsushogi, a game UI.

    Args:
        state: State or None
            If given, the UI starts with this state.
        action: Action or None
            If given, the UI will execute this action.
        piecename: str 
            Accepts one of ("emoji1", "emoji2", "emoji3", "hiragana")
            The name of piece images.
        ui_width: str or None
            If given, create the UI with this width.
            Currenly internal component sizes are calculated relative to this size.

    Returns: list
    """
    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    #
    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    # s = state or State.initial_state()
    #print(s)
    
    # default = list(s._data) + [s.status]

    # pass list to the component
    _state = None if state is None else state._data
    _action = None if action is None else [action.piece, action.index_from, action.index_to]
    assert piecename in ("emoji1", "emoji2", "emoji3", "hiragana")
    component_value = _component_func(
        piecename=piecename,
        state=_state,
        action=_action,
        ui_width=ui_width,
        # ui_width=1,
        # cellsize=cellsize,
        # piece_imgsize=piece_imgsize,
        # prisoner_imgsize=prisoner_imgsize,
        # init_data=s._data,
        key=key,
        default=[]
    )

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    logger.info("Received component value: %s", component_value)
    return _parse_component_value(component_value)


StDoubutsuShogiValue = namedtuple("StDoubutsuShogiValue", "state status action")

def _parse_component_value(component_value: list)-> tuple:
    size = len(component_value or [])
    state, action, status = None, None, None
    if size >= 19:
       state = State(component_value[:19])
    if size >= 20:
        status = component_value[19]
    if size >= 23:
        piece, index_from, index_to = component_value[20:23]
        action = Action(piece, index_from if index_from < 12 else PRISONER_INDEX, index_to)
    return StDoubutsuShogiValue(state=state, status=status, action=action)


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run my_component/__init__.py`
if __name__ == "__main__":
    if not _RELEASE:
        # test run of the local app
        # to do this, we add this component to the pythonpath, so that the app uses this local package
        # we also add the app directory and call its main function here

        if False:
            x = st_doubutsushogi()
            print(x)

            x = st_doubutsushogi(ui_width="150px", key=2)
            print(x)

            x = st_doubutsushogi(ui_width="400px", key=3)
            print(x)
        else:
            import os
            import sys
            componentdir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../"))
            appdir = os.path.join(componentdir, "app")
            sys.path.insert(0, appdir)
            sys.path.insert(0, componentdir)
            import streamlit_app
            streamlit_app.main()


