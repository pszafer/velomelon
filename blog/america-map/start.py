#!/usr/bin/python3
import os
import re
import fileinput
import requests

main_dir = "/home/poznan.tbhydro.net/admin/Projekty/prywatne/gatsby/velomelon/blog/america-map"
directory = os.fsencode(main_dir)
temp_name = 'temp_file'

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".txt"):
        print("MAM TXT")
        temp = open(temp_name, "w")
        filepath = os.path.join(main_dir, filename)
        f = open(filepath, "r")
        f1 = f.readlines()
        for x in f1:
            if "a" in x:
                url = re.findall('href="(.*?)"', x, re.DOTALL)[0]
                imgName = url.rsplit("/", 1)[1].lower()
                imgPath = os.path.join(main_dir, imgName)
                if not os.path.isfile(imgPath):
                    r = requests.get(url)
                    with open(imgPath, 'wb') as image:
                        image.write(r.content)
                x = '![](./{})\n'.format(imgName)
            temp.write(x)
        temp.close()
        f.close()
        os.remove(filepath)
        os.rename(temp_name, filepath)
                    #download file
                ##CHECK IF FILE JPG EXISTS HERE ALREADY
                ## IF NOT DOWNLOAD
                ## IF YES REPLACE STRING IMG WITH ()[]
