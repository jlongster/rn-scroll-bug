//
//  CachedImageManager.m
//  Blink
//
//  Created by Sam Mueller on 8/17/17.
//  Copyright © 2017 Blink. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(CachedImageManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(source, NSString);

@end

