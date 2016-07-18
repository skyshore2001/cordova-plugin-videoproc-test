//
//  VideoProc.h
//  HelloCordova
//
//  Created by 管伟东 on 16/7/14.
//
//

#import <Foundation/Foundation.h>
typedef void (^SuccessBlock)(NSString * fileName);
typedef void (^FaildBlock)(NSString * errorString);
@interface VideoProc : NSObject

- (void)compose:(NSString *)videoFile withConfig:(NSDictionary *)configInfo withSuccess:(SuccessBlock)successcb withFaild:(FaildBlock)faildcb;

@end
