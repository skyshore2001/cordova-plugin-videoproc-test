//
//  RenderFilter.m
//  HelloCordova
//
//  Created by 管伟东 on 16/7/15.
//
//

#import "RenderFilter.h"
#import "Video_Const.h"
#import "ConfigItem.h"
#import "Uitiltes.h"
NSString *const kVertShaderString = SHADER_STRING
(
 attribute vec4 position;
 attribute vec2 inputTextureCoordinate;
 varying vec2 textureCoordinate;
 void main()
 {
     gl_Position = position  ;
     textureCoordinate = inputTextureCoordinate;
 }
 );


NSString *const kFragShaderString = SHADER_STRING
(
 varying highp vec2 textureCoordinate;
 
 uniform sampler2D Sampler;
 
 void main()
 {
     mediump vec4 out_Color = texture2D(Sampler, textureCoordinate);
     gl_FragColor =vec4(out_Color.r,out_Color.g,out_Color.b,out_Color.a) ;
 }
 );

GLfloat quadVertexData [] = {
    -1.0 , -1.0, 1.0,
    1.0 , -1.0, 1.0,
    -1.0 ,  1.0, 1.0,
    1.0 ,  1.0, 1.0
};
@interface RenderFilter()
{
    CVOpenGLESTextureRef destTexture;
    CVOpenGLESTextureRef foregroundTexture;
}
@property(nonatomic ,strong)NSMutableArray  *    configItemsArray;
@property(nonatomic ,strong)NSMutableArray  *    picTureArray ;

@end

@implementation RenderFilter

- (instancetype)init
{
    self = [super initWithVertexShaderFromString:kVertShaderString fragmentShaderFromString:kFragShaderString];
    if (!self)return nil;
    [self addAttributeWithName:@"inputTextureCoordinate"];
    [self addAttributeWithName:@"position"];
    [self setProgram];
    filterPositionAttribute = [filterProgram attributeIndex:@"position"];
    filterTextureCoordinateAttribute = [filterProgram attributeIndex:@"inputTextureCoordinate"];
    glEnableVertexAttribArray(filterPositionAttribute);
    glEnableVertexAttribArray(filterTextureCoordinateAttribute);
    return self;
}

- (void)_handleConfigItems:(NSArray *)configItems
{
    if(self.configItemsArray.count !=0)return;
    self.configItemsArray = [NSMutableArray arrayWithArray:configItems];
    for (int index = 0; index <self.configItemsArray.count; index++) {
        ConfigItem * item = self.configItemsArray[index];
        if (item.type == kMediaType_Picture) {
            UIImage * image = [UIImage imageWithContentsOfFile:item.value];
            CVPixelBufferRef pixelBuffer = [Uitiltes cVPixelBufferFrome:image];
            CVOpenGLESTextureRef textureBuffer = [self bgraTextureForPixelBuffer:pixelBuffer];
            [self.picTureArray addObject:(__bridge id _Nonnull)(textureBuffer)];
        }else if(item.type ==kMediaType_Text){
            
        }
        
    }
}
- (void)renderPixelBuffer:(CVPixelBufferRef)destinationPixelBuffer usingForegroundSourceBuffer:(CVPixelBufferRef)foregroundPixelBuffer withComposition:(CMTime)compositionTime winthConfigItem:(NSArray *)configItems
{
    [self _handleConfigItems:configItems];
    [self setProgram];
    glBindFramebuffer(GL_FRAMEBUFFER, offscreenBufferHandle);
    [self renderObjectWithPixel:destinationPixelBuffer];
    foregroundTexture = NULL;
    if (foregroundPixelBuffer) {
        glActiveTexture(GL_TEXTURE0);
        [self setInteger:0 forUniformName:@"Sampler"];
        foregroundTexture = [self bgraTextureForPixelBuffer:foregroundPixelBuffer];
        glBindTexture(CVOpenGLESTextureGetTarget(foregroundTexture), CVOpenGLESTextureGetName(foregroundTexture));
        [self setDefaultTextureAttributes];
        glVertexAttribPointer(filterTextureCoordinateAttribute, 2, GL_FLOAT, 0, 0,[[self class] textureCoordinatesForRotation:kGPUImageNoRotation]);
        glEnableVertexAttribArray(filterTextureCoordinateAttribute);
        glViewport(0, 0, (int)CVPixelBufferGetWidth(destinationPixelBuffer), (int)CVPixelBufferGetHeight(destinationPixelBuffer));
        glClearColor(0.0, 0.0, 0.0, 1.0);
        glClear(GL_COLOR_BUFFER_BIT);
        [self renderWithTime:compositionTime];
    }
bail:
    if(foregroundTexture !=NULL){
        CFRelease(foregroundTexture);
        foregroundTexture =NULL;
    }
    if(destTexture!=NULL){
        CFRelease(destTexture);
        destTexture = NULL;
    }
    CVOpenGLESTextureCacheFlush(self.videoTextureCache, 0);
    [EAGLContext setCurrentContext:nil];
}

- (void)renderObjectWithPixel:(CVPixelBufferRef)pixelBuffer
{
    destTexture = [self bgraTextureForPixelBuffer:pixelBuffer];
    glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, CVOpenGLESTextureGetTarget(destTexture), CVOpenGLESTextureGetName(destTexture), 0);
}

- (void)renderWithTime:(CMTime)compositionTime
{
    glVertexAttribPointer(filterPositionAttribute, 3, GL_FLOAT, 0, 0,quadVertexData);
    glEnableVertexAttribArray(filterPositionAttribute);
    glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
}

@end
