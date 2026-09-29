#!/usr/bin/env python3
from setuptools import setup, find_packages

setup(
    name="uuidna-qpu",
    version="1.0.0",
    description="UUIDNA Quantum Processing Unit - Pure mathematical quantum computation",
    author="UUIDNA Foundation",
    license="MIT",
    py_modules=["qpu"],
    python_requires=">=3.8",
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "Intended Audience :: Science/Research",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Topic :: Scientific/Engineering :: Physics",
        "Topic :: Security :: Cryptography",
    ],
    long_description=open("README.md").read() if __import__("os").path.exists("README.md") else "",
    long_description_content_type="text/markdown",
)
