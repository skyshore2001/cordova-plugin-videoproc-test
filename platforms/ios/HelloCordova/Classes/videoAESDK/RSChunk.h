//
//  RSMedia.h
//  VideoAe
//
//  Created by 管伟东 on 16/4/5.
//  Copyright © 2016年 rootsport Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RSVideoChannel.h"
#import "RSAudioChannel.h"
typedef enum {
    TransitionStyle_none = 0,
    TransitionStyle_fade,
}TransitionStyle;

@interface RSChunk : NSObject
@property (nonatomic ,assign) CMTime     duration             ;
@property (nonatomic ,strong) RSChunk *  originChunk          ;
@property (nonatomic ,retain) RSVideoChannel       * video;
@property (nonatomic ,retain) RSAudioChannel       * audio;
@property (nonatomic ,assign) TransitionStyle      transitionStyle;
@property (nonatomic ,assign) CGFloat              transitionDuration;
@property (nonatomic ,assign) CMTime               startTime;
@property (nonatomic ,assign) CMTime     endTime              ;
@property (nonatomic ,assign) CMTimeRange          timeRange;
@property (nonatomic ,assign) kPlayerFrameSizeType frameType;
@property (nonatomic ,assign) float      volume               ;
@property (nonatomic,assign ) CGSize               videoFrameSize;
- (instancetype)initWithVideo:(RSVideoChannel *)video withAudio:(RSAudioChannel *)audio;
- (instancetype)initWithVideoComposition:(AVMutableComposition *)mixCompostion ;
- (instancetype)initWithUrlString:(NSString *)urlString;  
- (instancetype)initWithALAssetUrl:(NSURL *)url;

@end
