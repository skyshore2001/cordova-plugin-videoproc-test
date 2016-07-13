plugin=plugins/cordova-plugin-videoproc
plugin_itf=$(plugin)/www/videoproc.js

all: android browser ios

clean: clean-android clean-browser clean-ios

define RULE_CP
cp $< $@
endef

define RULE_JS
tool/make_js.pl $< $@
endef

#### android
ANDROID_FILES=\
	platforms/android/assets/www/$(plugin_itf) \
	platforms/android/platform_www/$(plugin_itf) \
	platforms/android/assets/www/index.html \
	platforms/android/assets/www/js/index.js \
	platforms/android/src/com/oliveche/videoproc/VideoProc.java \

android: $(ANDROID_FILES)

clean-android:
	-rm -rf $(ANDROID_FILES)

platforms/android/src/com/oliveche/videoproc/%: $(plugin)/src/android/%
	$(RULE_CP)

platforms/android/platform_www/$(plugin)/%.js: $(plugin)/%.js
	$(RULE_JS)

platforms/android/assets/www/$(plugin)/%.js: $(plugin)/%.js
	$(RULE_JS)

platforms/android/assets/www/%: www/%
	$(RULE_CP)

#### browser

BROWSER_FILES=\
	platforms/browser/www/$(plugin_itf) \
	platforms/browser/platform_www/$(plugin_itf) \
	platforms/browser/www/index.html \
	platforms/browser/www/js/index.js \
	platforms/browser/www/plugins/cordova-plugin-videoproc/src/browser/VideoProcProxy.js \
	platforms/browser/platform_www/plugins/cordova-plugin-videoproc/src/browser/VideoProcProxy.js \

browser: $(BROWSER_FILES)

clean-browser:
	-rm -rf $(BROWSER_FILES)

platforms/browser/platform_www/$(plugin)/%.js: $(plugin)/%.js
	$(RULE_JS)

platforms/browser/www/$(plugin)/%.js: $(plugin)/%.js
	$(RULE_JS)

platforms/browser/www/%: www/%
	$(RULE_CP)

#### ios

IOS_FILES=\
	platforms/ios/www/$(plugin_itf) \
	platforms/ios/platform_www/$(plugin_itf) \
	platforms/ios/www/index.html \
	platforms/ios/www/js/index.js \
	platforms/ios/HelloCordova/Plugins/cordova-plugin-videoproc/CDVVideoProc.m \
	platforms/ios/HelloCordova/Plugins/cordova-plugin-videoproc/CDVVideoProc.h \

ios: $(IOS_FILES)

clean-ios:
	-rm -rf $(IOS_FILES)

platforms/ios/HelloCordova/Plugins/cordova-plugin-videoproc/%: $(plugin)/src/ios/%
	$(RULE_CP)

platforms/ios/platform_www/$(plugin)/%.js: $(plugin)/%.js
	$(RULE_JS)

platforms/ios/www/$(plugin)/%.js: $(plugin)/%.js
	$(RULE_JS)

platforms/ios/www/%: www/%
	$(RULE_CP)
