//
//  RSMVString.h
//  saber
//
//  Created by 管伟东 on 15/12/14.
//  Copyright © 2015年 rootsports Inc. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface RSMVString : UILabel
- (instancetype)initWithcString:(NSString  *)string; 
-(CVPixelBufferRef)convertViewToImage;
@end
