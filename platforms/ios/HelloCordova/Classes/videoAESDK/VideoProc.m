//
//  VideoProc.m
//  HelloCordova
//
//  Created by 管伟东 on 16/7/14.
//
//

#import "VideoProc.h"
#import "ConfigItem.h"
#import "RSVideoChannel.h"
#import "RSAudioChannel.h"
#import "RSChunk.h"
#import "RSExportSession.h"
@interface VideoProc()
@property (nonatomic ,strong)NSString * videoFile ;
@property (nonatomic ,strong)AVMutableComposition * mixComposition ;
@property (nonatomic ,strong)RSChunk  * mainVideoChunk ;
@property (nonatomic ,strong)NSArray  * configInfoArray;
@property (nonatomic ,strong)RSExportSession * exportSession;
@property (nonatomic ,strong)AVMutableVideoComposition * videoComposition;
@end
@implementation VideoProc

- (void)compose:(NSString *)videoFile withConfig:(NSString *)configJson
{
    self.configInfoArray  = [self _parseJsonString:configJson];
    if (self.configInfoArray.count==0) {
        NSLog(@"parse json String error");
        return;
    }
    self.videoFile = videoFile;
    self.mainVideoChunk = [[RSChunk alloc]initWithUrlString:videoFile];
    [self _mixVideoAndAudioNeedMix:YES];
    [self _doexport]; 
    
}
- (void)_mixVideoAndAudioNeedMix:(BOOL)needMix
{
    self.mixComposition = [AVMutableComposition composition];
    AVMutableCompositionTrack * videoTrack = [self.mixComposition addMutableTrackWithMediaType:AVMediaTypeVideo preferredTrackID:kCMPersistentTrackID_Invalid];
    [videoTrack insertTimeRange:CMTimeRangeMake(kCMTimeZero, self.mainVideoChunk.duration) ofTrack:self.mainVideoChunk.video.videoTrack atTime:kCMTimeZero error:nil];
    if (needMix) {
        AVMutableCompositionTrack * orignAudioTrack = [self.mixComposition addMutableTrackWithMediaType:AVMediaTypeAudio preferredTrackID:kCMPersistentTrackID_Invalid];
        [orignAudioTrack insertTimeRange:CMTimeRangeMake(kCMTimeZero, self.mainVideoChunk.duration) ofTrack:self.mainVideoChunk.audio.audioTrack atTime:kCMTimeZero error:nil];
    }
    for (ConfigItem *item in self.configInfoArray) {
        if (item.type == kMediaType_Audio) {
            NSString * audioString = [[NSBundle mainBundle]pathForResource:@"1" ofType:@"mp3"];
            RSAudioChannel * audioChannel = [[RSAudioChannel alloc]initWithMediaPath:audioString];
            AVMutableCompositionTrack * audioTrack  = [self.mixComposition addMutableTrackWithMediaType:AVMediaTypeAudio preferredTrackID:kCMPersistentTrackID_Invalid];
            [audioTrack insertTimeRange:CMTimeRangeMake(kCMTimeZero, self.mainVideoChunk.duration) ofTrack:audioChannel.audioTrack atTime:kCMTimeZero error:nil];
        }
    }
    self.videoComposition = [AVMutableVideoComposition videoCompositionWithPropertiesOfAsset:self.mixComposition];
    self.videoComposition.frameDuration = CMTimeMake(1, 25);
    self.videoComposition.renderSize = CGSizeMake(480, 320);
    
}

- (void)_doexport
{
    NSString * videoPath = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory,NSAllDomainsMask, YES)[0];
    videoPath = [videoPath stringByAppendingPathComponent:@"video.mp4"];
    NSFileManager * fileManager = [NSFileManager defaultManager];
    if([fileManager fileExistsAtPath:videoPath])[fileManager removeItemAtPath:videoPath error:nil];
    NSURL * fileUrl = [NSURL fileURLWithPath:videoPath];
    self.exportSession = [[RSExportSession  alloc]initWithAVAssert:self.mixComposition
                                                     withOutPutURL:fileUrl
                                              withVideoComposition:self.videoComposition
                                                      withAudioMix:nil];
    [self.exportSession doExportWithProcess:^(CGFloat process) {
        NSLog(@"process = %f",process);
    } withSuccess:^(AVAssetExportSession *exportSession) {
    } withFaild:^(NSError *exportError) {
    }];
}

- (NSArray *)_parseJsonString:(NSString *)config
{
    NSData * data = [config dataUsingEncoding:NSUTF8StringEncoding];
    id obj = [NSJSONSerialization JSONObjectWithData:data  options:NSJSONReadingMutableLeaves error:nil];
    NSMutableArray * configInfo = [NSMutableArray array];
    if (obj&&[obj isKindOfClass:[NSDictionary class]]) {
        obj = [(NSDictionary *)obj objectForKey:@"items"];
        for (NSDictionary * item in (NSArray *)obj) {
            ConfigItem * configItem = [[ConfigItem alloc]init];
            configItem.type = [self _returnType:[item objectForKey:@"type"]];
            configItem.value=[item objectForKey:@"value"];
            configItem.frome = [[item objectForKey:@"from"]integerValue];
            configItem.to = [[item objectForKey:@"to"]integerValue];
            configItem.pointX = [[item objectForKey:@"x"]integerValue];
            configItem.pointY = [[item objectForKey:@"y"]integerValue];
            [configInfo addObject:configItem];
        }
        return configInfo; 
    }
    return nil;
}

- (kMediaType)_returnType:(NSString *)typeStr
{
    if ([typeStr isEqualToString:@"video"]) {
        return kMediaType_Video;
    }else if([typeStr isEqualToString:@"audio"])
    {
        return kMediaType_Audio;
    }else if ([typeStr isEqualToString:@"image"])
    {
        return kMediaType_Picture;
    }else if([typeStr isEqualToString:@"text"])
    {
        return kMediaType_Text;
    }
    return kMediaType_unKnown;
}
@end
