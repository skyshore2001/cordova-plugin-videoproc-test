test for plugin cordova-plugin-videoproc

	cp -r plugins/cordova-plugin-videoproc ./
	cordova plugin remove cordova-plugin-videoproc
	cordova plugin add cordova-plugin-videoproc

update platform from plugin: (sync src and www)

	make browser|android|ios
	make clean-browser|clean-android|clean-ios
	make clean|all

update plugin from platform: (sync src)

	make -f makefile2 browser|android|ios
	make -f makefile2 clean-browser|clean-android|clean-ios
	make -f makefile2 clean|all

