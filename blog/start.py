#!/usr/bin/python3
import os
import re
import fileinput
import requests

main_dir = "/home/poznan.tbhydro.net/admin/Projekty/prywatne/gatsby/velomelon/blog"
directory = os.fsencode(main_dir)
patImgSrc = re.compile('src\s *=\s*"([^"]+)"')
temp_name = 'temp_file'

for dir in os.listdir(directory):
    dir_str = os.fsdecode(dir)
    if os.path.isdir(dir):
        for file in os.listdir(dir):
            filename = os.fsdecode(file)
            if filename.endswith(".mdx"):
                temp = open(temp_name, "w")
                filepath = os.path.join(main_dir, dir_str, filename)
                f = open(filepath, "r")
                f1 = f.readlines()
                for x in f1:
                    if "img" in x and "googleusercontent.com" in x:
                        url = re.findall('src="(.*?)"', x, re.DOTALL)[0].replace("s400", "s1600")
                        imgName = url.rsplit("/", 1)[1].lower()
                        imgPath = os.path.join(main_dir, dir_str, imgName)
                        if not os.path.isfile(imgPath):
                            r = requests.get(url)
                            with open(imgPath, 'wb') as image:
                                image.write(r.content)
                        x = '!()[./{}]\n'.format(imgName)
                    temp.write(x)
                temp.close()
                f.close()
                os.remove(filepath)
                os.rename(temp_name, filepath)
                            #download file
                        ##CHECK IF FILE JPG EXISTS HERE ALREADY
                        ## IF NOT DOWNLOAD
                        ## IF YES REPLACE STRING IMG WITH ()[]
