# -*- coding: utf-8 -*-

import setuptools
import os
readmefile = os.path.join(os.path.dirname(__file__), "README.md")
with open(readmefile) as f:
    readme = f.read()

setuptools.setup(
    name="streamlit-doubutsushogi",
    version="0.0.7",
    author='Kota Mori', 
    author_email='kmori05@gmail.com',
    description="A streamlit custom component for doubutsushogi (animal chess) game",
    long_description=readme,
    long_description_content_type="text/markdown",
    url="",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[
        # By definition, a Custom Component depends on Streamlit.
        # If your component has other Python dependencies, list
        # them here.
        "streamlit >= 0.63",
        "doubutsushogi"
    ],
)
