#include <sys/types.h>
#include <sys/sysctl.h>
#import <Cordova/CDV.h>
#import "CDVVideoProc.h"

@implementation CDVVideoProc

- (void)compose:(CDVInvokedUrlCommand*)command
{
	NSString *videoFile = [command.arguments objectAtIndex:0];
    NSDictionary *opt = [command.arguments objectAtIndex:1];
	
	if (videoFile != nil && [videoFile length] == 0) {
		NSString *errstr = @"找不到文件";
		CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errstr];
		[self.commandDelegate sendPluginResult:result callbackId:self.currentCallbackId];
		return;
	}
	
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:videoFile];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

	/*
	[self.commandDelegate runInBackground:^{
        NSString* payload = nil;
        // Some blocking logic...
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:payload];
        // The sendPluginResult method is thread-safe.
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
	*/
}

@end
