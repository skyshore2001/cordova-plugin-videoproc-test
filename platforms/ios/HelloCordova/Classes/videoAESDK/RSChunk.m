//
//  RSMedia.m
//  VideoAe
//
//  Created by 管伟东 on 16/4/5.
//  Copyright © 2016年 rootsport Inc. All rights reserved.
//

#import "RSChunk.h"

@implementation RSChunk
- (instancetype)initWithALAssetUrl:(NSURL *)url
{
    self = [super init];
    if(!self)return nil;
    self.video = [[RSVideoChannel alloc]initWithALAssertUrl:url];
    self.audio = [[RSAudioChannel alloc]initWithALAssertUrl:url];
    [self _setDefaultConfig];
    return self;
}
- (instancetype)initWithVideo:(RSVideoChannel *)video withAudio:(RSAudioChannel *)audio
{
    self = [super init];
    if(!self)return nil;
    self.video = video;
    self.audio = audio;
    [self _setDefaultConfig];
    return self;
}

- (instancetype)initWithVideoComposition:(AVMutableComposition *)mixCompostion
{
    self = [super init];
    if(!self)return nil;
    self.video = [[RSVideoChannel alloc]initWithALAsset:mixCompostion];
    self.audio = [[RSAudioChannel alloc]initWithALAsset:mixCompostion];
    [self _setDefaultConfig];
    return self;
}
- (instancetype)initWithUrlString:(NSString *)urlString
{
    self = [super init];
    if(!self)return nil;
    self.video = [[RSVideoChannel alloc]initWithMediaPath:urlString];
    self.audio = [[RSAudioChannel alloc]initWithMediaPath:urlString];
    [self _setDefaultConfig]; 
    return self;
}
- (void)_setDefaultConfig
{
    self.volume = 1.0f;
    self.transitionStyle = TransitionStyle_none;
    self.transitionDuration = 0.0;
}

- (CMTime)duration
{
    return self.video.mediaDuration;
}
- (CGSize)videoFrameSize
{
    return [self.video natureSize];
}
- (kPlayerFrameSizeType)frameType
{
    if((int)[self videoFrameSize].height == 480){
        return kPlayerFrameType480P;
    }else if ((int)[self videoFrameSize].height==540){
        return kPlayerFrameType540P;
    }else if ((int)[self videoFrameSize].height==720){
        return kPlayerFrameType720P;
    }else if ((int)[self videoFrameSize].height==1080){
        return kPlayerFrameType1080P;
    }else
        return kPlayerFrameTypeUnkown;
}
@end
