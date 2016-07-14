//
//  ConfigItem.m
//  HelloCordova
//
//  Created by 管伟东 on 16/7/14.
//
//

#import "ConfigItem.h"

@implementation ConfigItem
- (instancetype)init
{
    self = [super init];
    if(!self)return nil;
    self.type = kMediaType_unKnown;
    self.value = @"";
    self.frome = 0;
    self.to = 0 ;
    self.pointY = 0 ;
    self.pointX = 0 ; 
    return self;
}
@end
