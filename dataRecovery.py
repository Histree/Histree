import wptools

so = wptools.page('Edmund Tudor, 1st Earl of Richmond').get_parse()
infobox = so.data['infobox']
# print(infobox)
print(infobox['module'])