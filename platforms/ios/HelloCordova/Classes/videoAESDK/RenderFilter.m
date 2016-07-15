//
//  RenderFilter.m
//  HelloCordova
//
//  Created by 管伟东 on 16/7/15.
//
//

#import "RenderFilter.h"
#import "Video_Const.h"
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

- (void)renderPixelBuffer:(CVPixelBufferRef)destinationPixelBuffer usingForegroundSourceBuffer:(CVPixelBufferRef)foregroundPixelBuffer withComposition:(CMTime)compositionTime
{
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
