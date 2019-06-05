#!/usr/bin/python3
import os
import sys
import re
import fileinput
import requests


def run_creation(dir_name):
    text = """---
title: 'title'
date: 2017
author: patrycja
caption: bidon.jpg
hidden: false
tags: 
    - usa
---


"""
    main_dir = "/home/poznan.tbhydro.net/admin/Projekty/prywatne/gatsby/velomelon/blog"
    path = os.path.join(main_dir, dir_name)
    plIndex = os.path.join(main_dir, dir_name, "index.pl.mdx")
    enIndex = os.path.join(main_dir, dir_name, "index.mdx")
    os.mkdir(path)
    if os.path.isdir(path):
        mdxEn = open(enIndex, "w")
        mdxEn.write(text)
        mdxEn.close()
        mdxPl = open(plIndex, "w")
        mdxPl.write(text)
        mdxPl.close()

if sys.argv[1]:
    run_creation(sys.argv[1])